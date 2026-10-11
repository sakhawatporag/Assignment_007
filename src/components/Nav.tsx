'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import TodayDate from './TodayDate';
import { authClient } from '@/lib/auth-client';

const Nav = () => {
    const { data: session, isPending } = authClient.useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const user = session?.user;

    async function handleSignOut() {
        await authClient.signOut();
        setMenuOpen(false);
    }

    return (
        <header className="border-b border-[#e6f0e9] bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8 md:py-5">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0b7a37] p-2 sm:h-12 sm:w-12">
                        <Image src="/logo-icon.png" alt="বাজার দর লোগো" width={32} height={32} />
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold text-[#1D271F] sm:text-2xl">বাজার দর</h1>
                        <span className="block truncate text-xs text-slate-500 sm:text-sm">
                            <TodayDate />
                        </span>
                    </div>
                </div>

                <nav aria-label="প্রধান নেভিগেশন" className="relative flex shrink-0 items-center gap-1 font-['Hind_Siliguri',sans-serif] sm:gap-4">
                    {isPending ? (
                        <div className="h-10 w-28 animate-pulse rounded-xl bg-[#edf4ee]" aria-label="লোড হচ্ছে" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                aria-expanded={menuOpen}
                                aria-haspopup="menu"
                                className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-[#1d271f] transition hover:bg-[#f0f7f1] sm:px-3 sm:text-lg"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f3ea] text-lg" aria-hidden="true">
                                    {user.name.trim().charAt(0).toUpperCase()}
                                </span>
                                <span className="max-w-28 truncate">{user.name}</span>
                                <span className="text-xs text-[#819087]" aria-hidden="true">▾</span>
                            </button>

                            {menuOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-64 rounded-2xl border border-[#dfe9e1] bg-white p-5 shadow-[0_12px_30px_rgba(30,83,48,0.14)]"
                                >
                                    <p className="truncate text-lg font-bold text-[#1d271f]">{user.name}</p>
                                    <p className="truncate text-sm text-[#819087]">{user.email}</p>
                                    <div className="my-4 h-px bg-[#edf2ee]" />
                                    <Link
                                        href="/"
                                        role="menuitem"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-base font-semibold text-[#4c5850] transition hover:bg-[#f5faf6] hover:text-[#008744]"
                                    >
                                        <span aria-hidden="true">👤</span>
                                        আমার প্রোফাইল
                                    </Link>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => void handleSignOut()}
                                        className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-base font-semibold text-[#e34f4f] transition hover:bg-[#fff5f5]"
                                    >
                                        <span aria-hidden="true">↩</span>
                                        সাইন আউট
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                className="group relative px-2 py-2 text-sm font-bold text-slate-800 transition-colors hover:text-[#008744] sm:px-3 sm:text-lg"
                            >
                                সাইন ইন
                                <span className="absolute bottom-1.5 left-2.5 right-2.5 h-0.5 origin-center scale-x-0 rounded bg-[#008744] transition-transform duration-200 group-hover:scale-x-100 sm:left-3 sm:right-3" />
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-xl bg-[#008744] px-3.5 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,135,68,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#00994c] hover:shadow-[0_8px_20px_rgba(0,135,68,0.45)] active:translate-y-0 sm:px-6 sm:py-3 sm:text-lg"
                            >
                                সাইন আপ
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Nav;