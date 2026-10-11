'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState<'google' | 'github' | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/',
      });

      if (signInError) {
        setError(signInError.message || 'সাইন ইন করা যায়নি। ইমেইল ও পাসওয়ার্ড যাচাই করুন।');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch (submitError) {
      console.error('Error signing in:', submitError);
      setError('সাইন ইন করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }

  }

  async function handleSocialSignIn(provider: 'google' | 'github') {
    setError('');
    setSocialSubmitting(provider);
    try {
      const { error: socialError } = await authClient.signIn.social({
        provider,
        callbackURL: '/',
      });
      if (socialError) {
        setError(
          socialError.message ||
            `${provider} লগইন করা যায়নি। Vercel-এর auth configuration যাচাই করুন।`,
        );
        setSocialSubmitting(null);
      }
    } catch (socialError) {
      console.error(`Error signing in with ${provider}:`, socialError);
      setError(`${provider} দিয়ে সাইন ইন করা যায়নি। OAuth সেটিংস যাচাই করুন।`);
      setSocialSubmitting(null);
    }
  }

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
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                minLength={6}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="h-12 w-full rounded-lg border border-[#dfe8e1] bg-white px-3 text-sm outline-none transition placeholder:text-[#9ba59e] focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/10"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-[#f3d6d6] bg-[#fff7f7] px-3 py-2 text-sm font-semibold text-[#b44242]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-[#009b45] text-base font-bold text-white shadow-[0_4px_8px_rgba(0,135,68,0.28)] transition hover:bg-[#008744] focus:outline-none focus:ring-2 focus:ring-[#008744]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'সাইন ইন হচ্ছে...' : 'সাইন ইন'}
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
              onClick={() => void handleSocialSignIn('google')}
              disabled={isSubmitting || socialSubmitting !== null}
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[#dfe8e1] text-xs font-semibold text-[#4c5850] transition hover:bg-[#f7faf7] sm:text-sm"
            >
              <span className="font-bold text-[#4285f4]" aria-hidden="true">
                G
              </span>
              {socialSubmitting === 'google' ? 'লোড হচ্ছে...' : 'Google দিয়ে চালিয়ে যান'}
            </button>
            <button
              type="button"
              onClick={() => void handleSocialSignIn('github')}
              disabled={isSubmitting || socialSubmitting !== null}
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[#dfe8e1] text-xs font-semibold text-[#4c5850] transition hover:bg-[#f7faf7] sm:text-sm"
            >
              <span className="font-bold text-[#24292f]" aria-hidden="true">
                ●
              </span>
              {socialSubmitting === 'github' ? 'লোড হচ্ছে...' : 'GitHub দিয়ে চালিয়ে যান'}
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