import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-orange-700 shadow-lg px-6 py-3 flex items-center fixed top-0 w-full z-10">
      <h1 className="text-2xl font-bold text-white tracking-wide">
        <Link to="/">Onlyne Tools</Link>
      </h1>
      <div className="flex space-x-6 px-6">
        <Link
          to="/"
          className="text-white hover:bg-orange-900 px-3 py-2 rounded transition-colors font-medium"
        >
          Home
        </Link>
        <Link
          to="/qrcode"
          className="text-white hover:bg-orange-900 px-3 py-2 rounded transition-colors font-medium"
        >
          Qr Code
        </Link>
      </div>
    </nav>
  );
}
