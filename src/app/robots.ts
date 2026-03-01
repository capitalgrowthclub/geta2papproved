import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/sign-in", "/join", "/eligibility", "/privacy", "/terms", "/refund"],
        disallow: ["/dashboard/", "/api/", "/client-intake/", "/doc/"],
      },
    ],
    sitemap: "https://www.geta2papproved.com/sitemap.xml",
  };
}
