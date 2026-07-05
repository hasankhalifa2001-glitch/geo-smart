"use client";

import { type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Button } from "@/components/ui/button";

const cardHoverTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

interface ModeSpotlightCardProps {
    href: string;
    buttonLabel: string;
    buttonClassName: string;
    children: ReactNode;
}

export function ModeSpotlightCard({
    href,
    buttonLabel,
    buttonClassName,
    children,
}: ModeSpotlightCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const spotlightBackground = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.15), transparent 80%)`;

    return (
        <motion.div
            className="group relative flex flex-col justify-between overflow-hidden p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 group-hover:border-emerald-500/30 transition-colors duration-300 shadow-sm hover:shadow-emerald-500/5"
            onMouseMove={handleMouseMove}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={cardHoverTransition}
        >
            <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                style={{ background: spotlightBackground }}
            />
            <div className="relative z-10 flex min-h-full flex-1 flex-col justify-between">
                <div>{children}</div>
                <Link href={href} className="mt-6 block">
                    <Button className={buttonClassName}>{buttonLabel}</Button>
                </Link>
            </div>
        </motion.div>
    );
}
