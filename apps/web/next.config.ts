import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName =
	process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "responsive-breadcrumb";

const nextConfig: NextConfig = {
	typedRoutes: true,
	output: isGithubPages ? "export" : undefined,
	basePath: isGithubPages ? `/${repositoryName}` : undefined,
	assetPrefix: isGithubPages ? `/${repositoryName}/` : undefined,
	trailingSlash: isGithubPages,
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
