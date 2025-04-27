import React from 'react';
import Footer from '../(root)/_components/Footer';
import Header from '../(root)/_components/header';

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
