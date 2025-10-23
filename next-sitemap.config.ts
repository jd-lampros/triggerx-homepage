/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.triggerx.network/",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  generateIndexSitemap: false,

  transform: async (config: any, path: string) => {
    // Exclude paths ending with image extensions
    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(path)) {
      return null; // Exclude this path from the sitemap
    }

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0,
    };
  },

  additionalPaths: async (config: any) => {
    const siteUrl = process.env.SITE_URL || "https://www.triggerx.network/";

    // Fetch blog slugs from Sanity
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/blogs?query=*[_type=="post"]{slug}`
    );

    const data = await response.json();
    console.log("Fetched slugs:", data.result); // ✅ Check if slugs are being fetched

    const posts = data.result || [];
    return posts.map((post: any) => ({
      loc: `${siteUrl}/blog/${post.slug.current}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.7,
    }));
  },
};
