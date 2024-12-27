import ClientHeader from "@/components/layout/clientHeader/ClientHeader";
import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <ClientHeader />
      {children}
    </>
  );
}
