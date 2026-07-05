"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const rotatingWords = ["Smart", "Precise", "Instant", "Simple"];
const TYPING_SPEED_MS = 100;
const DELETING_SPEED_MS = 75;
const PAUSE_AFTER_TYPED_MS = 2000;
const PAUSE_AFTER_DELETED_MS = 300;

const gradientTextClass =
    "bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500";

export function RotatingTypewriter() {
    const [wordIndex, setWordIndex] = useState(0);
    const [substring, setSubstring] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const currentWord = rotatingWords[wordIndex];

        if (isTyping) {
            if (substring.length < currentWord.length) {
                const timeout = setTimeout(() => {
                    setSubstring(currentWord.slice(0, substring.length + 1));
                }, TYPING_SPEED_MS);
                return () => clearTimeout(timeout);
            }

            const timeout = setTimeout(() => {
                setIsTyping(false);
            }, PAUSE_AFTER_TYPED_MS);
            return () => clearTimeout(timeout);
        }

        if (substring.length > 0) {
            const timeout = setTimeout(() => {
                setSubstring(substring.slice(0, -1));
            }, DELETING_SPEED_MS);
            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            setWordIndex((prev) => (prev + 1) % rotatingWords.length);
            setIsTyping(true);
        }, PAUSE_AFTER_DELETED_MS);
        return () => clearTimeout(timeout);
    }, [wordIndex, substring, isTyping]);

    return (
        <span className="inline-flex items-baseline">
            <motion.span className={gradientTextClass}>{substring}</motion.span>
            <motion.span
                className={gradientTextClass}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                aria-hidden
            >
                |
            </motion.span>
        </span>
    );
}
