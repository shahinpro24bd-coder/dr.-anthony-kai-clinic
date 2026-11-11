import { describe, expect, it } from "vitest";
import indexHtml from "../../site/index.html?raw";
import reelsScript from "../../../public/js/reels.js?raw";

const POSTS = ["DfSgLGTRBt5", "DdrFmaZihW7", "Ddjm3YZgtM3", "DdmKpOqgjj_", "DewvEzKAgFs", "DeE91IpCIo2"];

describe("home Instagram gallery", () => {
  it("shows six of Dr. Anthony El Kai's Instagram posts as click-to-load cards", () => {
    for (const post of POSTS) expect(indexHtml).toContain(`data-reel-play="${post}"`);
    expect(indexHtml.match(/data-reel-play=/g)).toHaveLength(6);
    expect(indexHtml).toContain("https://www.instagram.com/reel/DfSgLGTRBt5/");
  });

  it("plays the downloaded Reel directly without an Instagram player", () => {
    const button = indexHtml.match(/<button[^>]+data-reel-play="DfSgLGTRBt5"[^>]*>/)?.[0];
    expect(button).toContain('data-reel-src="/videos/why-general-practice.mp4"');
    expect(indexHtml.match(/data-reel-src=/g)).toHaveLength(1);
    expect(indexHtml).not.toMatch(/<iframe[^>]+instagram\.com/i);
    expect(reelsScript).toContain('document.createElement("video")');
    expect(indexHtml).toContain('src="js/reels.js"');
  });
});
