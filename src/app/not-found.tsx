import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fcf8] px-4 py-12 text-center">
      <section>
        <p className="text-8xl font-black leading-none tracking-tight text-[#d62828] sm:text-[11rem]">
          404
        </p>
        <h1 className="mt-5 text-2xl font-extrabold text-[#1d271f] sm:text-3xl">
          পেজটি পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-sm text-[#7c887f] sm:text-base">
          আপনি যে ঠিকানাটি খুঁজছেন সেটি সঠিক নয় অথবা পেজটি সরিয়ে ফেলা হয়েছে।
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-[#008744] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,135,68,0.25)] transition hover:bg-[#00733a] focus:outline-none focus:ring-2 focus:ring-[#008744]/30"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
