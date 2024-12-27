// layout.js
import AuthHeader from "@/components/layout/authHeader/AuthHeader";
import Footer from "@/components/layout/footer/Footer";
import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
}
