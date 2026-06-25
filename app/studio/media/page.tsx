import fs from "fs";
import path from "path";
import MediaUploader from "@/components/MediaUploader";

export const dynamic = "force-dynamic";

function listUploads(): { name: string; url: string }[] {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) return [];
  return fs
    .readdirSync(uploadsDir)
    .filter((name) => name !== ".gitkeep")
    .map((name) => ({
      name,
      url: `/uploads/${name}`,
      mtime: fs.statSync(path.join(uploadsDir, name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);
}

export default function StudioMediaPage() {
  const files = listUploads();

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold text-on-surface">Media Library</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Images uploaded from the article editor and this page.
      </p>

      <div className="mt-6 max-w-xl">
        <MediaUploader />
      </div>

      <div className="mt-10">
        {files.length === 0 ? (
          <p className="rounded-lg border border-dashed border-outline-variant p-10 text-center text-sm text-on-surface-variant">
            No media uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest"
              >
                <div className="aspect-square w-full bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user uploads, next/image optimization not needed for admin-only library */}
                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                </div>
                <p className="truncate px-3 py-2 text-xs text-on-surface-variant">{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
