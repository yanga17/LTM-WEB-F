'use client'

import { useSession } from '@/context';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/shared/ui/navigation';

export default function AppWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const { user } = useSession();

    const hideNavigation = pathname?.toLocaleLowerCase()?.includes('/login')

    if (!user) {
        return;
    }

    return (
        <main className={`w-full h-screen flex flex-col lg:justify-between lg:flex-row lg:gap-2 overflow-hidden md:ease-in-out md:duration-500 bg-black ${!hideNavigation && 'lg:p-2'}`}>
            {/* 
                Hide the navigation on small and medium screens.On large screens, the navigation should be visible unless hideNavigation is true.
                The classes hidden sm:hidden md:hidden lg:block hide the navigation on small and medium screens, while lg:block ensures it's visible on large screens by overriding the hidden class.
            */}
            <nav className={`${hideNavigation ? 'hidden' : 'lg:block hidden sm:hidden md:hidden lg:w-[12.33%]'}`}>
                <Navigation />
            </nav>
            {/* Adjust the content area based on whether the navigation is visible. */}
            <div className={`${hideNavigation ? 'w-full' : 'lg:w-[88.00%] lg:rounded'} h-full bg-grey`}>
                {children}
            </div>
        </main >
    )
}