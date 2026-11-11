import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { DEFAULT_CONTACT } from "../admin-store";

const PAGES = ["index", "about", "service", "appoinment", "contact"];
const OLD = /svinareva|dinasvinareva|fatema|mirza|nihaia|biadse|972532815272|voronezh|belgorod/i;

describe("Dr. Anthony El Kai contact details", () => {
  it("uses 81 866 011 for calls and WhatsApp", () => {
    expect(DEFAULT_CONTACT.phone).toBe("+961 81 866 011");
    expect(DEFAULT_CONTACT.whatsapp).toBe("+961 81 866 011");
    const contact = readFileSync("src/site/contact.html", "utf8");
    expect(contact).toContain('phoneNumber = "96181866011"');
  });

  it("links to the @dr.anthonykai Instagram profile", () => {
    expect(DEFAULT_CONTACT.instagram).toBe("https://www.instagram.com/dr.anthonykai/");
  });

  it("keeps no trace of the previous doctors on any page", () => {
    for (const page of PAGES) {
      expect(readFileSync(`src/site/${page}.html`, "utf8")).not.toMatch(OLD);
    }
    expect(readFileSync("src/lib/site-content/fallback.generated.json", "utf8")).not.toMatch(OLD);
  });
});
