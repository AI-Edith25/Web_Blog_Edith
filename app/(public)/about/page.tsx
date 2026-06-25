import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { CLINIC_WHATSAPP_URL } from "@/lib/constants";
import { SPECIALISTS } from "@/lib/specialists";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Edith Clinic",
  description:
    "Learn about Edith Clinic's philosophy, where dermatological precision meets aesthetic artistry.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar variant="light" />

      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-secondary">Our Story</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.1] text-on-surface lg:text-5xl">
            About Edith Clinic
          </h1>
          <p className="mt-6 text-base leading-relaxed text-on-surface-variant lg:text-lg">
            Edith Clinic was founded on a simple conviction: that skincare deserves the same rigor
            as clinical medicine, and the same care as fine craft. We bring together
            dermatological research and aesthetic artistry to deliver protocols that are precise,
            considered, and built around the patient in front of us.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-on-surface">Our Philosophy</h2>
            <p className="mt-4 leading-relaxed text-on-surface-variant">
              Every protocol at Edith Clinic begins with diagnosis, not assumption. We treat skin
              as a living system shaped by biology, environment, and time — and we design
              treatments that respect that complexity rather than fight it.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-on-surface">Our Standard</h2>
            <p className="mt-4 leading-relaxed text-on-surface-variant">
              From the first consultation to long-term maintenance, our clinicians hold every
              protocol to a clinical standard of safety and an editorial standard of detail —
              because lasting results come from both.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-outline-variant pt-16">
          <p className="eyebrow text-secondary-container">The Hands of Excellence</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-on-surface">
            Meet Our Specialists
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {SPECIALISTS.map((doctor) => (
              <div key={doctor.name} className="rounded-lg border border-outline-variant p-6">
                <p className="font-display text-lg font-semibold text-on-surface">{doctor.name}</p>
                <p className="eyebrow mt-1 text-secondary">{doctor.role}</p>
                <p className="font-display mt-3 text-sm italic leading-relaxed text-on-surface-variant">
                  &ldquo;{doctor.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 rounded-lg bg-primary p-8 text-on-primary lg:p-10">
          <h2 className="font-display text-2xl font-semibold">Ready to begin?</h2>
          <p className="max-w-md text-on-primary/70">
            Book a consultation and our specialists will design a protocol tailored to your skin.
          </p>
          <a
            href={CLINIC_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow rounded bg-secondary px-6 py-3 text-on-secondary transition-opacity hover:opacity-90"
          >
            Book a Consultation
          </a>
        </div>
      </Container>
    </>
  );
}
