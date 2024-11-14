import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      "@assets": path.resolve(__dirname, "../shared/assets"),
    };

    config.resolve.roots = [
      path.resolve("public"),
      path.resolve(__dirname, "../shared"),
    ];

    return config;
  },
};

export default nextConfig;
