import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Responsive Breadcrumb — The Breadcrumb That Always Fits",
	description:
		"A measured, accessible responsive breadcrumb for React and shadcn/ui that never overflows.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<div data-vaul-drawer-wrapper >
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
