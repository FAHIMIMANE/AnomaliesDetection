import Link from "next/link";
import Cookies from "js-cookie";

export default function AdminHeader() {
  const handleLogout = () => {
    Cookies.remove("loggedin");
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
      <div className="fs-3 fw-bold">
        <Link href="/" className="text-white text-decoration-none">
          My App
        </Link>
      </div>
      <nav className="d-flex gap-3">
        <Link href="/admin/home" className="btn btn-primary">
          Home
        </Link>
        <Link href="/admin/contact" className="btn btn-primary">
          Contact
        </Link>
        
        {/*

        <Link href="/" onClick={handleLogout} className="btn btn-danger">
          Logout
        </Link>
        
        */}

      </nav>
    </header>
  );
}
