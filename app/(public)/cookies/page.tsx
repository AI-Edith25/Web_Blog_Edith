import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { CLINIC_WHATSAPP_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cookie Policy — Edith Clinic",
  description: "How Edith Clinic uses cookies on its website.",
};

export default function CookiesPage() {
  return (
    <>
      <Navbar variant="light" />

      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-secondary">Legal</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.1] text-on-surface lg:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-sm text-on-surface-variant">Last updated: June 23, 2026</p>

          <div className="prose-edith mt-10">
            <p>
              This Cookie Policy explains how Edith Clinic uses cookies and similar technologies
              on our website.
            </p>

            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They
              help the site remember your preferences and understand how it is being used.
            </p>

            <h2>How We Use Cookies</h2>
            <p>
              We use cookies to keep our website running smoothly, remember your settings between
              visits, and understand which articles and protocols readers find most useful so we
              can keep improving our content.
            </p>

            <h2>Types of Cookies We Use</h2>
            <ul>
              <li>
                <strong>Essential cookies</strong> — required for the site to function correctly.
              </li>
              <li>
                <strong>Analytics cookies</strong> — help us understand how visitors use our site.
              </li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>
              Most browsers let you control or delete cookies through their settings. Disabling
              cookies may affect how parts of our website function.
            </p>

            <h2>Contact Us</h2>
            <p>
              Questions about this Cookie Policy can be sent to us{" "}
              <a href={CLINIC_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                via WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
