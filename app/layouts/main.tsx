import { Outlet, Link } from "react-router";

export default function MainLayout() {
  return (
    <>
      <nav className="flex justify-between items-center py-6 px-12">
        <div className="grid grid-cols-3 items-center w-full">
          <p className="text-4xl font-semibold uppercase font-mono tracking-tighter justify-start">
            The Online Store
          </p>
          <div className="hidden lg:flex justify-center space-x-8 items-center">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/shop" className="hover:underline">
              Shop
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
            <Link to="/blog" className="hover:underline">
              Blog
            </Link>
          </div>
          <div className="hidden lg:flex justify-end space-x-6 text-2xl items-center">
            <i className="fa fa-search cursor-pointer text-gray-600"></i>
            <i className="fa fa-user cursor-pointer text-gray-600"></i>
            <Link to="/cart">
              <i className="fa fa-shopping-cart cursor-pointer text-gray-600"></i>
            </Link>
          </div>
        </div>
        <div className="lg:hidden">
          <button className="text-3xl">
            <i className="fa fa-bars"></i>
          </button>
        </div>
      </nav>
      <div className="w-full h-0.25 bg-black mt-4"></div>
      <main>
        <Outlet />
      </main>
    </>
  );
}
