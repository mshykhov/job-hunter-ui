import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { test } from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const script = new URL("./a11y.mjs", import.meta.url);

test("waits for the application root before running axe", async () => {
  const server = createServer((_request, response) => {
    response.end(`<!doctype html>
      <html lang="en">
        <head><title>Delayed application</title></head>
        <body>
          <div id="root"></div>
          <script>
            setTimeout(() => {
              document.querySelector("#root").innerHTML = "<main><h1>Ready</h1></main>";
            }, 50);
          </script>
        </body>
      </html>`);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.notEqual(address, null);
    assert.equal(typeof address, "object");
    const { stdout } = await execFileAsync(process.execPath, [
      script.pathname,
      `http://127.0.0.1:${address.port}`,
    ]);
    const report = JSON.parse(stdout);

    assert.deepEqual(report.violations, []);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test("rejects unsupported URL protocols", async () => {
  await assert.rejects(
    execFileAsync(process.execPath, [script.pathname, "file:///tmp/index.html"]),
    (error) => error.code === 2 && error.stderr.includes("Unsupported URL protocol")
  );
});
