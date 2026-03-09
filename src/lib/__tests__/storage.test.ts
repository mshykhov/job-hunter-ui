import { describe, it, expect, beforeEach } from "vitest";
import { createStorage } from "../storage";

interface TestData {
  name: string;
  value?: string;
  count?: number;
}

const DEFAULTS: TestData = { name: "default", value: "initial" };

describe("createStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("load", () => {
    it("returns defaults when nothing is saved", () => {
      const storage = createStorage<TestData>("test", 1, DEFAULTS);
      expect(storage.load()).toEqual(DEFAULTS);
    });

    it("returns saved data merged with defaults", () => {
      const storage = createStorage<TestData>("test", 1, DEFAULTS);
      storage.save({ name: "custom", count: 42 });

      const loaded = storage.load();
      expect(loaded.name).toBe("custom");
      expect(loaded.count).toBe(42);
      expect(loaded.value).toBe("initial"); // default fills missing key
    });

    it("clears and returns defaults on version mismatch", () => {
      const v1 = createStorage<TestData>("test", 1, DEFAULTS);
      v1.save({ name: "old" });

      const v2 = createStorage<TestData>("test", 2, DEFAULTS);
      expect(v2.load()).toEqual(DEFAULTS);
      expect(localStorage.getItem("test")).toBeNull();
    });

    it("clears and returns defaults on malformed JSON", () => {
      localStorage.setItem("test", "not-json");
      const storage = createStorage<TestData>("test", 1, DEFAULTS);

      expect(storage.load()).toEqual(DEFAULTS);
      expect(localStorage.getItem("test")).toBeNull();
    });
  });

  describe("save — undefined value preservation", () => {
    it("preserves explicitly cleared values (undefined → null) through round-trip", () => {
      const storage = createStorage<TestData>("test", 1, DEFAULTS);

      // User clears `value` — sets it to undefined
      storage.save({ name: "custom", value: undefined });

      const loaded = storage.load();
      // BUG REGRESSION: without the fix, `value` would be "initial" (default)
      // because JSON.stringify drops undefined keys
      expect(loaded.value).toBeNull();
      expect(loaded.name).toBe("custom");
    });

    it("keeps actual values intact (does not convert falsy values to null)", () => {
      const storage = createStorage<TestData>("test", 1, DEFAULTS);
      storage.save({ name: "test", value: "", count: 0 });

      const loaded = storage.load();
      expect(loaded.value).toBe("");
      expect(loaded.count).toBe(0);
      expect(loaded.name).toBe("test");
    });
  });

  describe("clear", () => {
    it("removes the entry from localStorage", () => {
      const storage = createStorage<TestData>("test", 1, DEFAULTS);
      storage.save({ name: "data" });
      expect(localStorage.getItem("test")).not.toBeNull();

      storage.clear();
      expect(localStorage.getItem("test")).toBeNull();
    });
  });
});
