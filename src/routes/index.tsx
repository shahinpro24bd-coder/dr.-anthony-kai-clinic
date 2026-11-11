import { createFileRoute } from "@tanstack/react-router";
import { SITE_LOGO_URL } from "@/lib/site-content/branding";

/** Home page — rendered from the bundled site markup. */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Anthony El Kai, MD | General Practitioner in Rayfoun, Keserwan" },
      { name: "description", content: "General practitioner in Rayfoun, Keserwan, Lebanon: consultations, check-ups, home visits, emergency care and chronic disease follow-up. Call 81 866 011." },
      { property: "og:title", content: "Dr. Anthony El Kai, MD | General Practitioner in Rayfoun, Keserwan" },
      { property: "og:description", content: "General practitioner in Rayfoun, Keserwan, Lebanon: consultations, check-ups, home visits, emergency care and chronic disease follow-up. Call 81 866 011." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: SITE_LOGO_URL,
        fetchPriority: "high",
      },
    ],
  }),
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { renderSitePage } = await import("@/lib/site-content/render.server");
        return renderSitePage(request, "index");
      },
    },
  },
});
