import type { Metadata } from "next";
import { pretendard } from "../utils/localFonts";

import "./globals.css";
import TanStackQueryProvider from "../utils/provider/tanstack-query-provider";
import RecoilProvider from "../utils/provider/recoil-provider";
import ToastProvider from "@/utils/provider/toast-provider";

export const metadata: Metadata = {
  title: "TEN PAST SEVEN - 백오피스",
  description:
    "사내 인원들만 사용할 수 있는 TEN PAST SEVEN 백오피스 페이지입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body className={`${pretendard.variable}`} suppressHydrationWarning>
        <TanStackQueryProvider>
          <RecoilProvider>
            <ToastProvider />
            {children}
          </RecoilProvider>
        </TanStackQueryProvider>
      </body>
    </html>
  );
}
