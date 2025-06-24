// components/Navbar.tsx

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
      <h1 className="text-xl font-bold text-teal-600">My Blog Web</h1>
      <div className="space-x-6">
        <Link href="/" className="text-teal-700 hover:underline font-medium">
          Home
        </Link>
        <Link
          href="/create"
          className="text-teal-700 hover:underline font-medium"
        >
          Create
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
