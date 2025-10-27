/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import arrow from "@/app/assets/blogs page/arrow.svg";

// Define interfaces for the blog data structure
interface HeadingPair {
  h2Heading: string;
  displayHeading: string;
}

interface BlogImage {
  asset: {
    url: string;
  };
  alt?: string;
}

interface BlogSlug {
  current: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: BlogSlug;
  ogImage?: BlogImage;
  body: any; // PortableText content
  headingPairs?: HeadingPair[];
}

// Define the component props interface
interface ClientSlugProps {
  blog: Blog;
}

export default function ClientSlug({ blog }: ClientSlugProps) {
  const router = useRouter();
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const headings = document.querySelectorAll("h2");
          let currentActive = "";

          for (let i = 0; i < headings.length; i++) {
            const rect = headings[i].getBoundingClientRect();

            // If heading is above 120px, set it as active
            if (rect.top <= 500) {
              currentActive = headings[i].innerText;
            } else {
              break; // Stop checking further, as the next heading hasn't reached 120px yet
            }
          }

          setActiveHeading(currentActive);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* <Header /> */}
      <main className="w-[95%] max-w-[2100px] mx-auto my-4 lg:my-20 xl:my-40 relative z-40">
        <article>
          <header className="mb-3 lg:mb-12 sm:mt-20 lg:mt-32">
            {blog.ogImage?.asset?.url ? (
              <div className="rounded-2xl border overflow-hidden">
                <Image
                  src={blog.ogImage.asset.url}
                  alt={blog.title || "Blog Image"}
                  fill
                  className="!relative"
                />
              </div>
            ) : (
              <div className="w-full h-[200px] rounded-2xl bg-green-50 relative overflow-hidden flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
            <div></div>
          </header>

          <div className="flex flex-col md:flex-row gap-2 md:gap-8 w-[97%] mx-auto">
            {/* Table of Content */}
            <aside className="w-full md:w-1/4 min-w-[230px] md:sticky top-24 h-full">
              {/* Mobile Dropdown */}
              <div className="md:hidden relative my-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex justify-between items-center px-4 py-2 bg-[#141313] text-white rounded-lg border border-[#5F5F5F] text-xs font-actayWide"
                >
                  Table Of Content
                  <span
                    className={`transform transition ${isOpen ? "rotate-180" : ""}`}
                  >
                    <Image src={arrow} alt="arrow"></Image>
                  </span>
                </button>

                {isOpen && (
                  <ul className="absolute w-full bg-[#141313] text-white rounded-lg border border-[#5F5F5F] mt-2 shadow-lg z-10 text-xs font-actay">
                    {blog.headingPairs?.map((pair: HeadingPair, index: number) => (
                      <li key={index} className="py-2 px-2">
                        <a
                          href={`#${pair.h2Heading}`}
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            const targetElement = document.getElementById(
                              pair.h2Heading
                            );
                            if (targetElement) {
                              const yOffset = -160; // Adjust the offset (200px from top)
                              const y =
                                targetElement.getBoundingClientRect().top +
                                window.scrollY +
                                yOffset;
                              window.scrollTo({ top: y, behavior: "smooth" });
                            }
                          }}
                          className={`text-xs hover:underline ${activeHeading === pair.h2Heading
                            ? "text-green-400 font-bold"
                            : "text-gray-300"
                            }`}
                        >
                          [ {index + 1} ] {pair.displayHeading}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <h2 className="hidden md:block font-actayWide text-sm lg:text-lg font-extrabold my-10">
                Table of Content
              </h2>
              <ul className="hidden md:block space-y-2 font-actay">
                {blog.headingPairs?.map((pair: HeadingPair, index: number) => (
                  <li key={index}>
                    <a
                      href={`#${pair.h2Heading}`}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        const targetElement = document.getElementById(
                          pair.h2Heading
                        );
                        if (targetElement) {
                          const yOffset = -160; // Adjust the offset (200px from top)
                          const y =
                            targetElement.getBoundingClientRect().top +
                            window.scrollY +
                            yOffset;
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      }}
                      className={`text-xs lg:text-sm 2xl:text-base hover:underline ${activeHeading === pair.h2Heading
                        ? "text-green-400 font-bold"
                        : "text-gray-300"
                        }`}
                    >
                      [ {index + 1} ] {pair.displayHeading}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Blog Content */}
            <article className="w-full md:w-3/4 mt-0 md:mt-10">
              <PortableText
                value={blog.body}
                components={{
                  types: {
                    image: ({ value }: { value: BlogImage }) => (
                      <div className="my-10 w-full h-auto">
                        {value?.asset?.url && (
                          <Image
                            src={value.asset.url}
                            alt={value.alt || "Blog Image"}
                            width={2500}
                            height={2000}
                            className="rounded-2xl !relative w-full h-auto"
                            quality={85}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                          />
                        )}
                      </div>
                    ),
                    youtube: ({ value }: { value: { url: string } }) => (
                      <div className="my-4 aspect-w-16 aspect-h-9">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${value?.url?.split("v=")[1]}`}
                          title="YouTube video player"
                          style={{ border: "none" }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ),
                  },
                  marks: {
                    strong: ({ children }: { children: React.ReactNode }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    em: ({ children }: { children: React.ReactNode }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ children }: { children: React.ReactNode }) => (
                      <code className="bg-gray-200 px-1 py-0.5 rounded">
                        {children}
                      </code>
                    ),
                    link: ({ value, children }: any) => (
                      <a
                        href={value?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {children}
                      </a>
                    ),
                  },
                  list: {
                    bullet: ({ children }: any) => (
                      <ul className="list-disc pl-6 my-2">{children}</ul>
                    ),
                    number: ({ children }: any) => (
                      <ol className="list-decimal pl-6 my-2">{children}</ol>
                    ),
                  },
                  block: {
                    h2: ({ children }: any) => {
                      const text = (children as any)?.[0]; // Extract text from children array
                      return (
                        <h2
                          id={text}
                          className="font-actayWide text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold mt-10 mb-4"
                        >
                          {text}
                        </h2>
                      );
                    },
                    h3: ({ children }: any) => {
                      const text = (children as any)?.[0];
                      return (
                        <h3
                          id={text}
                          className="text-sm sm:text-lg xl:text-xl 2xl:text-2xl mt-4"
                        >
                          {text}
                        </h3>
                      );
                    },
                    normal: ({ children }: any) => (
                      <p className="my-2 text-xs sm:text-sm xl:text-base 2xl:text-lg">
                        {children}
                      </p>
                    ),
                  },
                }}
              />
            </article>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => router.push("/blog")}
              className="bg-white rounded-full my-16 px-4 sm:px-6 lg:px-8 py-3 lg:py-4 text-black mx-auto text-xs sm:text-sm lg:text-base"
            >
              Go Back to blog Page
            </button>
          </div>
        </article>
      </main>
    </>
  );
}
