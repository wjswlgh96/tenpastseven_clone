import styles from "./layout.module.css";

import SideBar from "@/components/sidebar/sidebar";
import Content from "@/components/content/content";
import Header from "@/components/header/header";
import AuthProvider from "@/utils/provider/auth-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <AuthProvider />
      <SideBar />
      <Content>
        <Header />
        {children}
      </Content>
    </div>
  );
}
