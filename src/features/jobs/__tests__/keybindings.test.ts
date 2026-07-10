import { beforeEach, describe, expect, it, vi } from "vitest";

describe("keybindings", () => {
  let kb: typeof import("../keybindings");

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    kb = await import("../keybindings");
  });

  describe("defaults", () => {
    it("resolves default codes to their actions", () => {
      expect(kb.matchShortcut("KeyA")).toBe("markApplied");
      expect(kb.matchShortcut("KeyD")).toBe("markIrrelevant");
      expect(kb.matchShortcut("KeyX")).toBe("markIrrelevant");
      expect(kb.matchShortcut("KeyR")).toBe("resetStatus");
      expect(kb.matchShortcut("KeyO")).toBe("openOriginal");
      expect(kb.matchShortcut("KeyQ")).toBe("prevJob");
      expect(kb.matchShortcut("KeyE")).toBe("nextJob");
    });

    it("returns null for unbound keys", () => {
      expect(kb.matchShortcut("KeyZ")).toBeNull();
      expect(kb.matchShortcut("Enter")).toBeNull();
    });
  });

  describe("rebinding", () => {
    it("replaces all default codes with the new one", () => {
      kb.setBinding("markIrrelevant", "KeyJ");
      expect(kb.matchShortcut("KeyJ")).toBe("markIrrelevant");
      expect(kb.matchShortcut("KeyD")).toBeNull();
      expect(kb.matchShortcut("KeyX")).toBeNull();
    });

    it("persists overrides through a module reload", async () => {
      kb.setBinding("openOriginal", "KeyV");
      vi.resetModules();
      const fresh = await import("../keybindings");
      expect(fresh.matchShortcut("KeyV")).toBe("openOriginal");
      expect(fresh.matchShortcut("KeyO")).toBeNull();
    });

    it("notifies subscribers on change", () => {
      const listener = vi.fn();
      kb.subscribeKeybindings(listener);
      kb.setBinding("nextJob", "KeyN");
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("reports customization state and resets to defaults", () => {
      expect(kb.isCustomized()).toBe(false);
      kb.setBinding("prevJob", "KeyP");
      expect(kb.isCustomized()).toBe(true);
      kb.resetBindings();
      expect(kb.isCustomized()).toBe(false);
      expect(kb.matchShortcut("KeyQ")).toBe("prevJob");
      expect(kb.matchShortcut("KeyP")).toBeNull();
    });
  });

  describe("codeToLabel", () => {
    it("renders QWERTY labels for letter and digit codes", () => {
      expect(kb.codeToLabel("KeyA")).toBe("A");
      expect(kb.codeToLabel("Digit3")).toBe("3");
      expect(kb.codeToLabel("ArrowRight")).toBe("ArrowRight");
    });
  });
});
