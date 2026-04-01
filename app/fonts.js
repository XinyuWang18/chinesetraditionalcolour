import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const sourceHanSerif = localFont({
  src: [
    {
      path: "./SourceHanSerifSC-Regular.woff2",
      weight: "400",
    },
    {
      path: "./SourceHanSerifSC-Medium.woff2",
      weight: "500",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
