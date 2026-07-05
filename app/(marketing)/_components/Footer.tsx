import { Logo } from "@/components/logo";

export function Footer() {
    return (
        <footer className="border-t border-slate-250/60 dark:border-zinc-800/40 bg-white dark:bg-[#09090b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <Logo size="md" />
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-500">
                    &copy; {new Date().getFullYear()} GeoSmart. All rights reserved. Professional Real-Estate Surveying Platform.
                </p>
            </div>
        </footer>
    );
}
