import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Transfer System",
  description: "계좌이체 시스템 프론트엔드"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
