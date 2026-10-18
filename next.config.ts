import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // upscaled H3 frames live in versioned folders (d2/m2): a new render gets a new folder
      { source: "/burst/:set(d2|m2)/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
