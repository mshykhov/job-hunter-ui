import { execFile } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import {
  chmod,
  lstat,
  mkdir,
  readdir,
  realpath,
  rm,
  stat,
} from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const sessionPattern = /^\d{8}T\d{6}Z-[a-z0-9-]+-[a-f0-9]{8}$/;

function fail(message) {
  throw new Error(message);
}

function parseInteger(value, name) {
  if (!/^\d+$/.test(value ?? "")) fail(`${name} must be a non-negative integer`);
  return Number.parseInt(value, 10);
}

function parseArgs(argv) {
  const [action, ...args] = argv;
  if (action !== "begin" && action !== "prune") {
    fail("action must be begin or prune");
  }

  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!flag?.startsWith("--") || value === undefined || value.startsWith("--")) {
      fail(`invalid argument near ${flag ?? "end of command"}`);
    }
    if (values.has(flag)) fail(`duplicate argument ${flag}`);
    values.set(flag, value);
  }

  const allowed = action === "begin"
    ? new Set(["--repo", "--scope"])
    : new Set(["--repo", "--max-age-days", "--keep"]);
  for (const flag of values.keys()) {
    if (!allowed.has(flag)) fail(`unknown argument ${flag}`);
  }
  if (!values.has("--repo")) fail("--repo is required");

  if (action === "begin") {
    return {
      action,
      repo: values.get("--repo"),
      scope: sanitize(values.get("--scope") ?? "session", "scope"),
    };
  }
  return {
    action,
    repo: values.get("--repo"),
    maxAgeDays: parseInteger(values.get("--max-age-days") ?? "7", "--max-age-days"),
    keep: parseInteger(values.get("--keep") ?? "20", "--keep"),
  };
}

function sanitize(value, name) {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  if (!sanitized) fail(`${name} must contain an ASCII letter or number`);
  return sanitized;
}

async function canonicalRepository(input) {
  const requested = await realpath(resolve(input));
  if (!(await stat(requested)).isDirectory()) fail("--repo must be a directory");
  const { stdout } = await execFileAsync("git", [
    "-C",
    requested,
    "rev-parse",
    "--show-toplevel",
  ]);
  const gitRoot = await realpath(stdout.trim());
  if (gitRoot !== requested) fail("--repo must be the canonical Git root");
  return requested;
}

async function ensurePrivateDirectory(path) {
  try {
    const entry = await lstat(path);
    if (entry.isSymbolicLink() || !entry.isDirectory()) {
      fail(`cache path is not a real directory: ${path}`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await mkdir(path, { mode: 0o700 });
  }
  await chmod(path, 0o700);
}

async function cacheLocation(repository) {
  const configuredBase = resolve(
    process.env.XDG_CACHE_HOME || join(homedir(), ".cache"),
  );
  await mkdir(configuredBase, { recursive: true });
  const cacheBase = await realpath(configuredBase);
  const workbenchRoot = join(cacheBase, "ui-workbench");
  await ensurePrivateDirectory(workbenchRoot);

  const safeName = sanitize(basename(repository), "repository name");
  const digest = createHash("sha256").update(repository).digest("hex").slice(0, 12);
  const repositoryId = `${safeName}-${digest}`;
  const repositoryCache = join(workbenchRoot, repositoryId);
  await ensurePrivateDirectory(repositoryCache);
  return { repositoryCache, repositoryId };
}

function utcTimestamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function assertDirectChild(root, candidate) {
  if (dirname(candidate) !== root) fail(`unsafe cache candidate: ${candidate}`);
}

async function begin(options) {
  const repository = await canonicalRepository(options.repo);
  const { repositoryCache, repositoryId } = await cacheLocation(repository);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const name = `${utcTimestamp()}-${options.scope}-${randomBytes(4).toString("hex")}`;
    const directory = join(repositoryCache, name);
    assertDirectChild(repositoryCache, directory);
    try {
      await mkdir(directory, { mode: 0o700 });
      return { action: "begin", repositoryId, directory };
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
  fail("could not allocate a unique evidence session");
}

async function prune(options) {
  const repository = await canonicalRepository(options.repo);
  const { repositoryCache, repositoryId } = await cacheLocation(repository);
  const entries = [];

  for (const name of await readdir(repositoryCache)) {
    if (!sessionPattern.test(name)) continue;
    const path = join(repositoryCache, name);
    assertDirectChild(repositoryCache, path);
    const metadata = await lstat(path);
    entries.push({ name, path, metadata });
  }

  const symlinks = entries.filter(({ metadata }) => metadata.isSymbolicLink());
  const owned = entries
    .filter(({ metadata }) => !metadata.isSymbolicLink())
    .sort((left, right) => right.metadata.mtimeMs - left.metadata.mtimeMs);
  const cutoff = Date.now() - options.maxAgeDays * 24 * 60 * 60 * 1000;
  const removeEntries = [
    ...symlinks,
    ...owned.filter(({ metadata }, index) => (
      index >= options.keep || metadata.mtimeMs < cutoff
    )),
  ];

  for (const entry of removeEntries) {
    assertDirectChild(repositoryCache, entry.path);
    await rm(entry.path, { recursive: true, force: false });
  }
  const removed = new Set(removeEntries.map(({ name }) => name));
  return {
    action: "prune",
    repositoryId,
    removed: [...removed].sort(),
    kept: entries.map(({ name }) => name).filter((name) => !removed.has(name)).sort(),
  };
}

try {
  const options = parseArgs(process.argv.slice(2));
  const result = options.action === "begin" ? await begin(options) : await prune(options);
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
