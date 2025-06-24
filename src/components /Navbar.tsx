// components/Navbar.tsx

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
      <h1 className="text-xl font-bold text-teal-600">My Blog Web</h1>
      <div className="space-x-4">
        <Link
          href="/create"
          className="inline-block bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
        >
          + Create a Blog
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
