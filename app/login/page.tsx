"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">Login to your account</CardTitle>
                <CardDescription className="text-center text-zinc-400">
                    Enter your email and password to access your dashboard and projects
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {isRegistered && (
                        <div className="rounded bg-emerald-500/10 p-3 text-sm text-emerald-500 border border-emerald-500/20">
                            Account created successfully! Please log in.
                        </div>
                    )}
                    {error && (
                        <div className="rounded bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email</label>
                        <Input
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus-visible:ring-emerald-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus-visible:ring-emerald-500"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-center text-sm text-zinc-400">
                        {"Don't have an account?"}{" "}
                        <Link href="/register" className="text-emerald-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
            <Suspense fallback={<div className="text-zinc-100">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
