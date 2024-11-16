"use client";

import styles from "./layout.module.css";

import SideBar from "@/components/sidebar/sidebar";
import Content from "@/components/content/content";
import Header from "@/components/header/header";
import AuthProvider from "@/utils/provider/auth-provider";
import { useSearchParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isPopup = searchParams.has("popup");

  return (
    <div className={styles.container}>
      <AuthProvider />
      {isPopup ? (
        <>{children}</>
      ) : (
        <>
          <SideBar />
          <Content>
            <Header />
            {children}
          </Content>
        </>
      )}
    </div>
  );
}
