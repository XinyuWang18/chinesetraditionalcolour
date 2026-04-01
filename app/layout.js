import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-cn",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-en",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "中国传统色",
  description: "中国传统色展示网站",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body
        className={`
          ${notoSerifSC.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          bg-white text-gray-800
        `}
      >
        {children}
      </body>
    </html>
  );
}

