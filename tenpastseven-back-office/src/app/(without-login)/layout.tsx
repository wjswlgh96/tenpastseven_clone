"use client";

import { useSearchParams } from "next/navigation";

import SideBar from "@/components/organisms/sidebar/sidebar";
import ContentContainer from "@/components/atoms/containers/content-container";
import Header from "@/components/organisms/header/header";
import AuthProvider from "@/utils/providers/auth-provider";

import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isPopup = searchParams.has("popup");

  return (
    <div className={styles.container}>
      <AuthProvider />
      {isPopup ? (
        children
      ) : (
        <>
          <SideBar />
          <ContentContainer>
            <Header />
            {children}
          </ContentContainer>
        </>
      )}
    </div>
  );
}
