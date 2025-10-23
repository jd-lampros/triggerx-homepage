"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/app/context/SearchContext";

// Define the blog interface
interface Blog {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  readTime: number;
  ogDescription: string;
  ogImage?: {
    asset: {
      url: string;
    };
  };
}

// Define the component props interface
interface ClientBlogListProps {
  blogs: Blog[];
}

export default function ClientBlogList({ blogs }: ClientBlogListProps) {
  const { search } = useSearch();

  // Ensure blogs is an array
  const validBlogs: Blog[] = Array.isArray(blogs) ? blogs : [];

  const sortedBlogs: Blog[] = [...validBlogs].sort(
    (a, b) => new Date(b?.publishedAt || 0).getTime() - new Date(a?.publishedAt || 0).getTime()
  );

  const mostRecentBlog: Blog | undefined = sortedBlogs[0];
  const otherBlogs: Blog[] = sortedBlogs.slice(1);

  const filteredBlogs: Blog[] = search
    ? validBlogs.filter((blog: Blog) =>
      blog?.title?.toLowerCase().startsWith(search?.toLowerCase() || "")
    )
    : otherBlogs;


  return (
    <>
      {mostRecentBlog && (
        <Link href={`/blog/${mostRecentBlog.slug?.current}`}>
          {!search && (
            <div className="my-10 bg-[#0F0F0F] p-6 sm:p-9 md:p-14 lg:p-20 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 border border-[#5F5F5F] h-auto group">
              <div className="w-full md:w-[47%]">
                <p className="text-[#FBF197] text-xs sm:text-sm">
                  {new Date(mostRecentBlog.publishedAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )}
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sharpGrotesk font-light mt-4 leading-tight transform scale-y-[.8]">
                  {mostRecentBlog.title}
                </h2>
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-[#B7B7B7] text-xs sm:text-sm">
                  [{mostRecentBlog.readTime} min read]
                </p>
                <p className="text-gray-300 mt-3 sm:mt-7 font-actayWide font-light text-xs sm:text-sm md:text-base">
                  {mostRecentBlog.ogDescription}
                </p>
                <p className="text-white text-xs sm:text-sm md:text-base mt-3 sm:mt-12 lg:mt-20 xl:mt-24 inline-block group-hover:underline">
                  Read ↗
                </p>
              </div>
            </div>
          )}
        </Link>
      )}

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mb-40">
          {filteredBlogs.map((blog: Blog) => (
            <Link
              href={`/blog/${blog.slug?.current}`}
              key={blog._id}
              className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-[#0F0F0F] p-3 border border-[#5F5F5F] flex flex-col justify-between"
            >
              {blog.ogImage?.asset?.url ? (
                <div className="w-full h-[200px] rounded-2xl border border-[#5F5F5F] relative overflow-hidden">
                  <Image
                    src={blog.ogImage.asset.url}
                    alt={blog.title || "Blog Image"}
                    fill
                    className="h-full w-auto"
                  />
                </div>
              ) : (
                <div className="w-full h-[200px] rounded-2xl bg-green-50 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}

              <h2 className="font-actayWide text-base sm:text-xl group-hover:text-[#B7B7B7] transition-colors p-4 mt-4 sm:mt-8">
                {blog.title}
              </h2>

              <div className="mt-4 sm:mt-8 p-4">
                <time className="bg-[#222222] text-[#B7B7B7] px-6 py-2 rounded-lg w-max text-xs sm:text-sm">
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}{" "}
                  [{blog.readTime} min read]
                </time>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-400 text-lg">No blogs found.</p>
        </div>
      )}
    </>
  );
}
