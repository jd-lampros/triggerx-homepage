"use client"; // This component is a Client Component

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "./Header";

export default function HeaderFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudioPage = pathname.startsWith("/studio"); // Hide on /studio and subroutes

  return (
    <div className="overflow-x-hidden relative">
      <Header />
      <main className="relative z-30">{children}</main>
      {!isStudioPage && <Footer />}
    </div>
  );
}
