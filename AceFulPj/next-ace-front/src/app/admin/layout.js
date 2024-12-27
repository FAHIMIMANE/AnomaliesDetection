"use client";

import AdminHeader from "@/components/layout/adminHeader/AdminHeader";
import React from "react";
import Cookies from "js-cookie";
import AdminSideBar from "@/components/layout/adminSideBar/adminSideBar";

export default function Layout({ children }) {
  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      {children}
    </>
  );
}
