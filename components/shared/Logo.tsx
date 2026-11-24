import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function Logo({
  href = "/",
  className,
  imageClassName = "w-32",
  priority = false,
}: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src="/Image/onrent-logo.png"
        alt="OnRent"
        width={1955}
        height={520}
        priority={priority}
        className={cn("h-auto object-contain", imageClassName)}
      />
    </Link>
  );
}
