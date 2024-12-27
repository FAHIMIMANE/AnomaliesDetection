"use client";

import Link from "next/link";
import Cookies from "js-cookie";

export default function Home() {
  console.log(Cookies.get("loggedin"));

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="mb-4 text-primary">Hello World</h1>
      <Link href="/auth/login">
        <button className="btn btn-primary btn-lg">
          Let's Start
        </button>
      </Link>
    </div>
  );
}
