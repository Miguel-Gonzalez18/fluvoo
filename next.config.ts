import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/employee/home",
        destination: "/employee",
        permanent: true,
      },
      {
        source: "/freelancer/home",
        destination: "/freelancer",
        permanent: true,
      },
      {
        source: "/business/home",
        destination: "/business",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
