import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { CLINIC_ADDRESS, CLINIC_PHONE, CLINIC_WHATSAPP_URL } from "@/lib/constants";

const COLUMNS: {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    heading: "Treatments",
    links: [
      { label: "Skincare", href: "/category/Skincare" },
      { label: "Treatments", href: "/category/Treatments" },
      { label: "Anti-Aging", href: "/category/Anti-Aging" },
      { label: "Wellness", href: "/category/Wellness" },
    ],
  },
  {
    heading: "Clinic",
    links: [
      { label: "About Edith Clinic", href: "/about" },
      { label: "Book a Consultation", href: CLINIC_WHATSAPP_URL, external: true },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary text-on-primary">
      <Container className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <Logo className="h-14 w-auto object-contain" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-primary/70">
            Clinical elegance for the modern era — where dermatological precision meets aesthetic
            artistry.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className="eyebrow text-on-primary/50">{column.heading}</p>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-on-primary/80 transition-colors hover:text-secondary-container"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-on-primary/80 transition-colors hover:text-secondary-container"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-on-primary/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-on-primary/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Edith Clinic. All rights reserved.</p>
          <p>
            {CLINIC_ADDRESS} &middot;{" "}
            <a
              href={CLINIC_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-secondary-container"
            >
              {CLINIC_PHONE}
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
