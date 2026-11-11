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

  it("opens the gallery with the Why general practice Reel and numbers the cards in order", () => {
    const cards = indexHtml.slice(
      indexHtml.indexOf('<div class="reels-track"'),
      indexHtml.indexOf("</section>", indexHtml.indexOf('<div class="reels-track"')),
    );
    const codes = [...cards.matchAll(/data-reel-play="([^"]+)"/g)].map((m) => m[1]);
    expect(codes).toEqual(["DfSgLGTRBt5", "Ddjm3YZgtM3", "DdrFmaZihW7", "DdmKpOqgjj_", "DewvEzKAgFs", "DeE91IpCIo2"]);
    expect([...cards.matchAll(/<span class="reel-number">(\d\d)<\/span>/g)].map((m) => m[1])).toEqual(["01", "02", "03", "04", "05", "06"]);
  });

  it("closes the video section so the footer sits outside it", () => {
    const sectionEnd = indexHtml.indexOf("</section>", indexHtml.indexOf('<section class="reels-section"'));
    const footerStart = indexHtml.indexOf('<div class="container-fluid footer');
    expect(sectionEnd).toBeGreaterThan(0);
    expect(sectionEnd).toBeLessThan(footerStart);
    expect(indexHtml).toContain("reels-swipe-hint");
    expect(indexHtml).toContain('class="reels-follow" href="https://www.instagram.com/dr.anthonykai/"');
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
