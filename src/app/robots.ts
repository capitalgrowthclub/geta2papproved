import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/sign-in", "/sign-up"],
        disallow: ["/dashboard/", "/api/", "/client-intake/"],
      },
    ],
    sitemap: "https://www.geta2papproved.com/sitemap.xml",
  };
}
