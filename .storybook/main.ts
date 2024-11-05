import type { StorybookConfig } from "@storybook/nextjs";
import type { RuleSetRule } from "webpack";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    const imageRule = config.module?.rules?.find((rule) => {
      const test = (rule as { test: RegExp }).test;
      if (!test) {
        return false;
      }
      return test.test(".svg");
    }) as RuleSetRule;

    if (imageRule) {
      // @ts-ignore 또는 타입 단언을 사용
      imageRule.exclude = /\.svg$/;
    }

    config.module?.rules?.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // 절대 경로 설정
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
      };
    }

    return config;
  },
};

export default config;
