import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Edith Clinic — Clinical Elegance Journal",
    short_name: "Edith Clinic",
    description:
      "Editorial insights on dermatology, skincare science, and aesthetic medicine from Edith Clinic.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#181e34",
    icons: [
      {
        src: "/512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
