"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isRegistered = searchParams.get("registered") === "true";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/calculator/map");
                router.refresh();
            }
        } catch (err: unknown) {
            setError("Something went wrong during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md relative z-10"
        >
            {/* Ambient shadow glow around the card */}
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-3xl -z-10 pointer-events-none" />

            <div className="border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)] relative overflow-hidden">
                {/* Subtle tech grid highlights inside card */}
                <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-emerald-500/10 pointer-events-none rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-emerald-500/10 pointer-events-none rounded-bl-2xl" />

                {/* Card Header & Logo */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A2 2 0 013 15.485V8.515a2 2 0 011.553-1.791L9 4m6 16l5.447-2.724A2 2 0 0021 15.485V8.515a2 2 0 00-1.553-1.791L15 4m-6 16V4m6 20V4M9 4l6 10M9 10l6 10" />
                        </svg>
                    </div>
                    <Logo size="lg" href="/" className="text-3xl font-extrabold tracking-tight" />
                    <p className="text-zinc-400 text-xs mt-1.5 uppercase tracking-wider font-semibold">Surveying & Calculation Suite</p>
                </div>

                <div className="space-y-1 mb-6 text-center">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-100">Welcome Back</h2>
                    <p className="text-sm text-zinc-400">Enter your credentials to access your geospatial projects</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegistered && (
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Account created successfully! Please log in.</span>
                        </div>
                    )}
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <Input
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-zinc-800 bg-zinc-950/40 text-zinc-100 placeholder-zinc-600 rounded-lg h-11 pl-10 pr-4 transition-all duration-300 hover:border-zinc-700/80 focus-visible:border-emerald-500/80 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-zinc-800 bg-zinc-950/40 text-zinc-100 placeholder-zinc-600 rounded-lg h-11 pl-10 pr-4 transition-all duration-300 hover:border-zinc-700/80 focus-visible:border-emerald-500/80 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] h-11 rounded-lg font-semibold"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Authenticating...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    {/* Toggle Link */}
                    <p className="text-center text-sm text-zinc-400 mt-6">
                        {"Don't have an account?"}{" "}
                        <Link href="/register" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors hover:underline">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
            {/* Top Left Navigation Link */}
            <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center">
                <Link href="/" className="flex items-center gap-2 group text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>

            {/* SURVEYING MAP GRID OVERLAYS */}
            {/* Fine Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
            />
            {/* Major Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:160px_160px] pointer-events-none"
            />

            {/* Concentric Surveying Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-500/5 rounded-full pointer-events-none border-dashed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-emerald-500/10 rounded-full pointer-events-none" />

            {/* RADIAL GLOW FOR DEPTH */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Corner Decorative Crosshairs */}
            <div className="absolute top-10 right-10 text-emerald-500/10 font-mono text-xs select-none pointer-events-none hidden md:block">
                SYS_LOC: [35.2271° N, 80.8431° W]
            </div>
            <div className="absolute bottom-10 left-10 text-emerald-500/10 font-mono text-xs select-none pointer-events-none hidden md:block">
                GRID_REF: GS-992-AUTH
            </div>

            <Suspense fallback={<div className="text-zinc-100 font-medium">Initializing Secure Node...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
