
import Image from "next/image";
import TodayDate from "./TodayDate";

export default function Banner() {
  return (
    <section className="w-full px-4 py-8 font-['Hind_Siliguri',sans-serif] sm:px-6 md:px-8 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-8 overflow-hidden rounded-4xl bg-white px-6 py-8 shadow-[0_8px_30px_rgba(11,122,55,0.07)] sm:px-10 sm:py-10 md:flex-row md:px-14 md:py-12">
        <div className="flex w-full flex-1 flex-col items-start space-y-4 md:w-auto">
          
          <span className="inline-flex items-center rounded-full bg-[#e6f4ea] px-4 py-1.5 text-sm font-semibold text-[#008744]"><TodayDate /></span>
          

     
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

        
          <p className="max-w-xl text-base leading-relaxed text-[#6b7280] md:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          
          <div className="pt-2">
            <a
              href="#products"
              className="rounded-xl bg-[#008744] px-7 py-3 text-lg font-bold text-white shadow-[0_4px_14px_rgba(0,135,68,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00733a] hover:shadow-[0_6px_20px_rgba(0,135,68,0.4)] active:translate-y-0 active:scale-95"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        <div className="flex w-full flex-1 items-center justify-center md:w-auto md:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের পণ্যের ছবি"
            width={315}
            height={263}
            className="h-auto w-[min(100%,315px)]"
            priority
          />
        </div>

      </div>
    </section>
  );
}
