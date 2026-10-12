'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { getAuthErrorMessage } from '@/lib/auth-errors';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/signin');
    }
  }, [isPending, router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextName = String(formData.get('name') ?? '').trim();
    setError('');
    setMessage('');

    if (!nextName) {
      setError('নাম লিখুন।');
      return;
    }

    setIsSaving(true);
    try {
      const { error: updateError } = await authClient.updateUser({ name: nextName });
      if (updateError) {
        setError(getAuthErrorMessage(updateError, 'তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।'));
        return;
      }
      setMessage('আপনার তথ্য আপডেট হয়েছে।');
    } catch (updateError) {
      console.error('Error updating profile:', updateError);
      setError('তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.replace('/');
      router.refresh();
    } catch (signOutError) {
      console.error('Error signing out:', signOutError);
      setError('সাইন আউট করা যায়নি। আবার চেষ্টা করুন।');
      setIsSigningOut(false);
    }
  }

  if (isPending || !session) {
    return <main className="min-h-screen bg-[#f3f8f4]" />;
  }

  const initial = session.user.name.trim().charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#f3f8f4] px-4 py-8 text-[#1d271f] sm:py-12">
      <section className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold sm:text-3xl">আমার প্রোফাইল</h1>
          <p className="mt-1 text-sm text-[#7c887f]">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন</p>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-[#e2eae3] bg-white p-4 shadow-[0_4px_18px_rgba(30,83,48,0.06)] sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e8f3ea] text-xl font-bold text-[#008744]">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{session.user.name}</p>
              <p className="truncate text-sm text-[#819087]">{session.user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={isSigningOut}
            className="shrink-0 rounded-lg border border-[#ed8b8b] px-3 py-2 text-sm font-semibold text-[#df5d5d] transition hover:bg-[#fff5f5] disabled:opacity-60"
          >
            {isSigningOut ? 'সাইন আউট হচ্ছে...' : '↩ সাইন আউট'}
          </button>
        </div>

        <div className="rounded-2xl border border-[#e2eae3] bg-white p-5 shadow-[0_4px_18px_rgba(30,83,48,0.06)] sm:p-6">
          <h2 className="text-lg font-bold">তথ্য</h2>
          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <label htmlFor="profile-name" className="block text-sm font-semibold">
              নাম
            </label>
            <input
              id="profile-name"
              name="name"
              defaultValue={session.user.name}
              className="h-12 w-full rounded-lg border border-[#dfe8e1] bg-white px-3 text-sm outline-none transition focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/10"
              required
            />
            {error && <p className="text-sm font-semibold text-[#b44242]" role="alert">{error}</p>}
            {message && <p className="text-sm font-semibold text-[#008744]" role="status">{message}</p>}
            <button
              type="submit"
              disabled={isSaving}
              className="h-12 w-full rounded-lg bg-[#009b45] text-sm font-bold text-white shadow-[0_4px_8px_rgba(0,135,68,0.28)] transition hover:bg-[#008744] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'আপডেট হচ্ছে...' : 'আপডেট'}
            </button>
          </form>
        </div>

        <Link href="/" className="mt-5 block text-center text-sm text-[#819087] hover:text-[#008744]">
          ← হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
