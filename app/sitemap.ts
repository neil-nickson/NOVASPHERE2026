import type { MetadataRoute } from "next";

const baseUrl = "https://novasphere-2026.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/events`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/schedule`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/leaderboard`, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/code-of-conduct`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/legal-privacy-policy`, changeFrequency: "monthly", priority: 0.5 }
  ];
}
