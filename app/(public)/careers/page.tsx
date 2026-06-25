import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers — Edith Clinic",
  description: "Join the team behind Edith Clinic's clinical and editorial work.",
};

const VALUES: { name: string; description: string }[] = [
  {
    name: "Precision",
    description: "We hold every protocol, and every line of copy, to a clinical standard.",
  },
  {
    name: "Empathy",
    description: "We listen first. Every treatment plan starts with the patient in front of us.",
  },
  {
    name: "Curiosity",
    description: "We track the research and keep refining what we already do well.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar variant="light" />

      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-secondary">Join Our Team</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.1] text-on-surface lg:text-5xl">
            Careers at Edith Clinic
          </h1>
          <p className="mt-6 text-base leading-relaxed text-on-surface-variant lg:text-lg">
            We&apos;re a small team of clinicians, researchers, and writers building a clinic that
            treats skincare as both a science and a craft. If that sounds like your kind of work,
            we&apos;d like to hear from you.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.name}
              className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-soft"
            >
              <h3 className="font-display text-lg font-semibold text-on-surface">{value.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-outline-variant pt-16">
          <h2 className="font-display text-2xl font-semibold text-on-surface">Open Positions</h2>
          <p className="mt-4 max-w-xl text-on-surface-variant">
            We don&apos;t have any open roles posted right now, but we&apos;re always glad to hear
            from people who care about clinical skincare. Send your CV and a short note to{" "}
            <a
              href="mailto:careers@edithclinic.com"
              className="text-secondary underline decoration-secondary-container underline-offset-2"
            >
              careers@edithclinic.com
            </a>{" "}
            and we&apos;ll keep it on file for future openings.
          </p>
        </div>
      </Container>
    </>
  );
}
