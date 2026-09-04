#!/usr/bin/env node

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const [target, ...extra] = process.argv.slice(2);

if (!target || extra.length > 0) {
  console.error("Usage: a11y.mjs <http-or-https-url>");
  process.exit(2);
}

let url;
try {
  url = new URL(target);
} catch {
  console.error(`Invalid URL: ${target}`);
  process.exit(2);
}

if (!new Set(["http:", "https:"]).has(url.protocol)) {
  console.error(`Unsupported URL protocol: ${url.protocol}`);
  process.exit(2);
}

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(url.href, { waitUntil: "load" });
    await page.locator("#root > *").first().waitFor({ state: "attached" });
    const results = await new AxeBuilder({ page }).analyze();
    const report = {
      url: results.url,
      violations: results.violations,
      incomplete: results.incomplete,
      passes: results.passes.length,
    };
    console.log(JSON.stringify(report, null, 2));
    if (results.violations.length > 0) process.exitCode = 1;
  } finally {
    await context.close();
  }
} finally {
  await browser.close();
}
