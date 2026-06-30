import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ href = "/", className, size = "md" }: LogoProps) {
  const content = (
    <span className={cn("font-bold tracking-tight", sizeClasses[size], className)}>
      Geo<span className="text-emerald-500">Smart</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
