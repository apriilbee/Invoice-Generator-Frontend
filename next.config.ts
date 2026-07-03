import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:5001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/login/google", destination: `${API_URL}/login/google` },
      { source: "/oauth2callback", destination: `${API_URL}/oauth2callback` },
    ];
  },
};

export default nextConfig;
