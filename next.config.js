/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            dimensions: true,
            icon: false,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
