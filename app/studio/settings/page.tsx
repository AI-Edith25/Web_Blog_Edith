import { CLINIC_ADDRESS, CLINIC_PHONE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function StudioSettingsPage() {
  const passcodeEnabled = Boolean(process.env.STUDIO_PASSCODE);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold text-on-surface">Settings</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        General clinic information and Studio access configuration.
      </p>

      <div className="mt-8 max-w-xl rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
        <p className="eyebrow text-secondary">Clinic Information</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-on-surface-variant">Name</dt>
            <dd className="font-medium text-on-surface">Edith Clinic</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-on-surface-variant">Address</dt>
            <dd className="text-right font-medium text-on-surface">{CLINIC_ADDRESS}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-on-surface-variant">Phone</dt>
            <dd className="font-medium text-on-surface">{CLINIC_PHONE}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 max-w-xl rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
        <p className="eyebrow text-secondary">Studio Access</p>
        <div className="mt-4 flex items-center justify-between gap-4 text-sm">
          <div>
            <p className="font-medium text-on-surface">Passcode Protection</p>
            <p className="mt-1 text-on-surface-variant">
              {passcodeEnabled
                ? "Enabled via the STUDIO_PASSCODE environment variable."
                : "Disabled — /studio is open to anyone with the link."}
            </p>
          </div>
          <span
            className={`eyebrow shrink-0 rounded px-2.5 py-1 ${
              passcodeEnabled
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {passcodeEnabled ? "On" : "Off"}
          </span>
        </div>
      </div>
    </div>
  );
}
