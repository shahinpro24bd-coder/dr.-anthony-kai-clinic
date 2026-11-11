import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { SITE_LANGS, isSiteLang, getContentSnapshot } from "./server";
import { renderPage } from "./transform";
import { JSDOM } from "jsdom";

describe("public languages", () => {
  it("offers exactly English and Arabic (Lebanon)", () => {
    expect(SITE_LANGS).toEqual(["en", "ar"]);
    expect(isSiteLang("ar")).toBe(true);
    expect(isSiteLang("ru")).toBe(false);
  });

  it("bundles Arabic for every English content key", async () => {
    const snapshot = await getContentSnapshot();
    expect(Object.keys(snapshot.langs.ar).sort()).toEqual(Object.keys(snapshot.langs.en).sort());
    for (const [key, english] of Object.entries(snapshot.langs.en)) {
      if (/[a-z]{3}/i.test(english) && !/^@dr\.anthonykai$|^\+?[\d\s]+$/.test(english)) {
        expect(snapshot.langs.ar[key], english).toMatch(/[\u0600-\u06FF]/);
      }
    }
  });

  it("renders Arabic right-to-left and English left-to-right", () => {
    const html = "<html><head></head><body>Home</body></html>";
    expect(renderPage(html, { texts: {}, images: {}, lang: "ar" })).toContain('lang="ar" dir="rtl"');
    expect(renderPage(html, { texts: {}, images: {}, lang: "en" })).toContain('lang="en" dir="ltr"');
  });

  it("shows the Lebanese flag for Arabic in the switcher", () => {
    const script = readFileSync("public/js/i18n.js", "utf8");
    expect(script).toContain("/img/flag-lebanon.png");
    expect(existsSync("public/img/flag-lebanon.png")).toBe(true);
  });
});

describe("default language", () => {
  it("serves English when no language is chosen", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/index.html"), "index");
    expect(await res.text()).toContain('window.__SITE_LANG__="en"');
  });

  it("keeps cookie-selected pages out of shared caches", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/index.html", {
      headers: { cookie: "site_lang=ar" },
    }), "index");
    expect(await res.text()).toContain('window.__SITE_LANG__="ar"');
    expect(res.headers.get("Cache-Control")).toBe("private, no-cache");
    expect(res.headers.get("Vary")).toBe("Cookie");
    const fresh = await renderSitePage(new Request("http://x/index.html"), "index");
    expect(await fresh.text()).toContain('window.__SITE_LANG__="en"');
  });

  it("switches explicitly to Arabic even with a remembered English preference", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/about.html?lang=ar", {
      headers: { cookie: "site_lang=en" },
    }), "about");
    const html = await res.text();
    expect(html).toContain('window.__SITE_LANG__="ar"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("د. أنطوني القاعي");
    expect(res.headers.get("Cache-Control")).toContain("public");
  });

  it("renders English on an explicit switch even with an Arabic cookie", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/service.html?lang=en", {
      headers: { cookie: "site_lang=ar" },
    }), "service");
    expect(await res.text()).toContain('window.__SITE_LANG__="en"');
  });

  it("sends both dropdown choices as explicit language URLs", () => {
    const dom = new JSDOM('<div class="navbar-languages"></div>', {
      url: "http://x/?lang=en", runScripts: "outside-only",
    });
    const destinations: [string, string][] = [];
    Object.assign(dom.window, {
      __SITE_LANG__: "en",
      __siteGo: (url: string, lang: string) => destinations.push([url, lang]),
    });
    dom.window.eval(readFileSync("public/js/i18n.js", "utf8"));
    dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
    for (const lang of ["ar", "en"]) {
      const choice = dom.window.document.querySelector<HTMLAnchorElement>(`[data-lang="${lang}"]`);
      expect(choice?.getAttribute("href")).toBe(`/?lang=${lang}`);
      choice?.click();
    }
    expect(destinations).toEqual([["http://x/?lang=ar", "ar"], ["http://x/?lang=en", "en"]]);
    dom.window.close();
  });
});
