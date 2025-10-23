"use client";
import search1 from "@/app/assets/blogs page/search1.svg";
import search2 from "@/app/assets/blogs page/search2.svg";
import Image from "next/image";
import { useSearch } from "@/app/context/SearchContext";

export default function BlogHeader() {
  const { search, setSearch } = useSearch();

  return (
    <>
      <header className="w-[95%] mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h1 className="font-sharpGrotesk text-center text-4xl sm:text-5xl md:text-5xl xl:text-[70px] 2xl:text-[4vw] font-light transform scale-y-[.8] mb-8">
          Blog
        </h1>
        <div className="relative w-full sm:w-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#141313] text-v w-full sm:w-[300px] px-12 py-3 rounded-full focus:outline-none border border-[#5F5F5F]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevents unwanted navigation
            />
            <Image
              src={search1}
              alt="search"
              className="w-4 h-4 absolute left-4 top-3.5 pointer-events-none"
            />
            <button type="button" className="absolute right-0 top-0">
              <Image src={search2} alt="search" className="w-11 h-11" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
