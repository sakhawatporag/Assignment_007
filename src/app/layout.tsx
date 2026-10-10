import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: "400",
  subsets: ["bengali"],
});


export const metadata: Metadata = {
  title: "বাজার দর | আজকের বাজারের দাম",
  description: "বাংলাদেশের বাজারভিত্তিক পণ্যের সর্বশেষ দাম এক জায়গায়।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${hindSiliguri.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
