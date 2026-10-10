import React from 'react';
import Image from 'next/image';
import TodayDate from './TodayDate';

const Nav = () => {
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

                <nav aria-label="প্রধান নেভিগেশন" className="flex shrink-0 items-center gap-1 font-['Hind_Siliguri',sans-serif] sm:gap-4">
                    <a
                        href="#signin"
                        className="group relative px-2 py-2 text-sm font-bold text-slate-800 transition-colors hover:text-[#008744] sm:px-3 sm:text-lg"
                    >
                        সাইন ইন
                        <span className="absolute bottom-1.5 left-2.5 right-2.5 h-0.5 origin-center scale-x-0 rounded bg-[#008744] transition-transform duration-200 group-hover:scale-x-100 sm:left-3 sm:right-3" />
                    </a>
                    <a
                        href="#signup"
                        className="rounded-xl bg-[#008744] px-3.5 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,135,68,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#00994c] hover:shadow-[0_8px_20px_rgba(0,135,68,0.45)] active:translate-y-0 sm:px-6 sm:py-3 sm:text-lg"
                    >
                        সাইন আপ
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Nav;