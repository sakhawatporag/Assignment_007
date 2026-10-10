import Link from 'next/link';

export default function SignIn() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f8f4] px-4 py-10 text-[#1d271f]">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">সাইন ইন</h1>
          <p className="mt-1 text-sm text-[#7c887f]">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2eae3] bg-white p-5 shadow-[0_4px_18px_rgba(30,83,48,0.06)] sm:p-6">
          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                ইমেইল
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-lg border border-[#dfe8e1] bg-white px-3 text-sm outline-none transition placeholder:text-[#9ba59e] focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/10"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="h-12 w-full rounded-lg border border-[#dfe8e1] bg-white px-3 text-sm outline-none transition placeholder:text-[#9ba59e] focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/10"
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-lg bg-[#009b45] text-base font-bold text-white shadow-[0_4px_8px_rgba(0,135,68,0.28)] transition hover:bg-[#008744] focus:outline-none focus:ring-2 focus:ring-[#008744]/30"
            >
              সাইন ইন
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-[#89948c]">
            <span className="h-px flex-1 bg-[#e0e8e1]" />
            <span>অথবা</span>
            <span className="h-px flex-1 bg-[#e0e8e1]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[#dfe8e1] text-xs font-semibold text-[#4c5850] transition hover:bg-[#f7faf7] sm:text-sm"
            >
              <span className="font-bold text-[#4285f4]" aria-hidden="true">
                G
              </span>
              Google দিয়ে চালিয়ে যান
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[#dfe8e1] text-xs font-semibold text-[#4c5850] transition hover:bg-[#f7faf7] sm:text-sm"
            >
              <span className="font-bold text-[#24292f]" aria-hidden="true">
                ●
              </span>
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-[#89948c]">
            অ্যাকাউন্ট নেই?{' '}
            <Link href="/signup" className="font-semibold text-[#008744] hover:underline">
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-[#89948c] transition hover:text-[#008744]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}