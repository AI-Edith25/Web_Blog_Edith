import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { CLINIC_ADDRESS, CLINIC_WHATSAPP_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy — Edith Clinic",
  description: "How Edith Clinic collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar variant="light" />

      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-secondary">Legal</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.1] text-on-surface lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-on-surface-variant">Last updated: June 23, 2026</p>

          <div className="prose-edith mt-10">
            <p>
              This Privacy Policy describes how Edith Clinic (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
              collects, uses, and protects the information you share with us through our website
              and in connection with our clinical services.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as your name, contact
              details, and appointment preferences when you book a consultation through WhatsApp
              or our website, as well as basic usage data collected automatically when you browse
              our site.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
              We use this information to schedule and manage appointments, respond to enquiries,
              improve our website and editorial content, and communicate with you about our
              services.
            </p>

            <h2>Cookies &amp; Tracking</h2>
            <p>
              Our site may use cookies to remember your preferences and understand how our
              content is used. See our{" "}
              <a href="/cookies">Cookie Policy</a> for details on how to manage them.
            </p>

            <h2>Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect your
              information against unauthorized access, loss, or misuse. No method of transmission
              over the internet is completely secure, so we cannot guarantee absolute security.
            </p>

            <h2>Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information
              at any time by contacting us using the details below.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, reach us at {CLINIC_ADDRESS}, or{" "}
              <a href={CLINIC_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                message us on WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
