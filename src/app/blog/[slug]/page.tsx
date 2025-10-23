import ClientSlug from "@/components/blogs page/ClientSlug";
import { client } from "@/sanity/lib/client";

async function getBlog(slug: string) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0] {
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
    body[] {
      ...,
      asset -> {
        url
      }
    },
    headingPairs[] {
      h2Heading,
      displayHeading
    },
    blogReference[]->{
      _id,
      ogTitle,
      slug {
        current
      }
    }
  }`;

  return client.fetch(query);
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.seoTitle || blog.title,
    description: blog.metaDescription,
    alternates: {
      canonical: blog.canonicalUrl,
    },
    openGraph: {
      title: blog.ogTitle || blog.title,
      description: blog.ogDescription || blog.metaDescription,
      url:
        blog.ogUrl || `https://www.triggerx.network/blog/${blog.slug.current}`,
      images: blog.ogImage?.asset?.url ? [{ url: blog.ogImage.asset.url }] : [],
      type: "article",
      publishedTime: blog.publishedAt,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  console.log(blog);

  return <ClientSlug blog={blog} />;
}
