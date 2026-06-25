import Image from "next/image";
import Link from "next/link";
import logoLight from "@/public/edith-logo.png";
import logoDark from "@/public/edith-logo-dark.png";

export default function Logo({
  variant = "light",
  className = "h-12 w-auto object-contain sm:h-[60px]",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link href="/" aria-label="Edith Clinic — Home" className="flex shrink-0 items-center">
      <Image
        src={variant === "dark" ? logoDark : logoLight}
        alt="Edith Clinic"
        preload
        className="h-9 w-auto"
      />
    </Link>
  );
}
