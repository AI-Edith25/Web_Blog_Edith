import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { CLINIC_ADDRESS, CLINIC_WHATSAPP_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service — Edith Clinic",
  description: "The terms that govern your use of Edith Clinic's website and services.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar variant="light" />

      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-secondary">Legal</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.1] text-on-surface lg:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-on-surface-variant">Last updated: June 23, 2026</p>

          <div className="prose-edith mt-10">
            <p>
              These Terms of Service govern your use of the Edith Clinic website and the
              booking of consultations through it. By using our site, you agree to these terms.
            </p>

            <h2>Use of Content</h2>
            <p>
              All editorial content, images, and protocols published on this site are the
              property of Edith Clinic and are provided for informational purposes only. You may
              not reproduce or redistribute our content without permission.
            </p>

            <h2>Medical Disclaimer</h2>
            <p>
              Articles and protocols published on this journal are educational in nature and do
              not replace a personal consultation. Always consult one of our specialists before
              beginning a treatment.
            </p>

            <h2>Appointments &amp; Cancellations</h2>
            <p>
              Consultations booked through WhatsApp are subject to availability. We ask that you
              reschedule or cancel with as much notice as possible so we can offer the slot to
              another patient.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Edith Clinic is not liable for any indirect or incidental damages arising from your
              use of this website. Our clinical liability is governed separately by the consent
              and treatment agreements signed in clinic.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the site after
              changes are posted constitutes acceptance of the revised terms.
            </p>

            <h2>Contact Us</h2>
            <p>
              Questions about these Terms can be sent to us at {CLINIC_ADDRESS}, or{" "}
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
