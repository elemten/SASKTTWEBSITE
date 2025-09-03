import { useLocation, NavLink } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/ui/navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex items-center justify-center bg-gray-100 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <NavLink to="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </NavLink>
        </div>
      </div>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default NotFound;
