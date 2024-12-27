import Link from 'next/link';

const AuthHeader = () => {
  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
      <div className="fs-3 fw-bold">
        <h1 className="mb-0">My Website</h1>
      </div>
      <nav className="d-flex gap-3">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/auth/login" className="btn btn-primary">
          Login
        </Link>
        <Link href="/auth/register" className="btn btn-primary">
          Register
        </Link>
      </nav>
    </header>
  );
};

export default AuthHeader;
