import BlogHeader from "@/components/blogs page/BlogHeader";
import BlogList from "@/components/blogs page/BlogList";
import { SearchProvider } from "@/app/context/SearchContext";

export default function blogs() {
  return (
    <SearchProvider>
      <div className="w-[95%] max-w-[2100px] mx-auto my-20 mt-[10px] md:mt-[100px] lg:mt-[270px] relative z-40">
        <BlogHeader />
        <BlogList />
      </div>
    </SearchProvider>
  );
}
export const metadata = {
  metadataBase: new URL("https://www.triggerx.network/blog"),
  title: "TriggerX | Blog",
  description: "Automate Tasks Effortlessly",
  openGraph: {
    images: [
      {
        url: "opengraph-image.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "opengraph-image.jpg",
        width: 1800,
        height: 1600,
        alt: "Blog",
      },
    ],
  },
};
