import { client } from "@/sanity/lib/client";
import ClientBlogList from "./ClientBlogList";

const query = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  seoTitle,
  metaDescription,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage {
    asset -> {
      url
    }
  },
  ogUrl,
  slug {
    current
  },
  publishedAt,
  readTime,
}`;


async function getBlogs() {
  try {
    const blogs = await client.fetch(query);
    console.log("Fetched blogs:", blogs);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogList() {
  try {
    const blogs = await getBlogs();

    // Add null check before passing to ClientBlogList
    if (!blogs || !Array.isArray(blogs)) {
      console.error("Invalid blogs data:", blogs);
      return <div>Oops! we are facing some issues, Try again in some time!</div>;
    }

    return <ClientBlogList blogs={blogs} />;
  } catch (error) {
    console.error("Error in BlogList:", error);
    return <div>Oops! we are facing some issues, Try again in some time!</div>;
  }
}
