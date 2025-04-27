import React from "react";
import Header from "../(root)/_components/header";
import Footer from "../(root)/_components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
