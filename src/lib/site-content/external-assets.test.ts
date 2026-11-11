import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import indexHtml from "../../site/index.html?raw";
import fallback from "./fallback.generated.json?raw";

describe("bundled media", () => {
  it("serves every image and video from the project itself", () => {
    for (const source of [indexHtml, fallback]) {
      expect(source).not.toContain("/__l5e/assets-v1/");
      const paths = source.match(/\/(img|videos)\/[A-Za-z0-9._/-]+\.(webp|jpg|png|mp4)/g) || [];
      expect(paths.length).toBeGreaterThan(0);
      for (const p of paths) expect(existsSync(resolve("public", p.slice(1))), p).toBe(true);
    }
  });
});
