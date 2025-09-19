import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, LogIn } from "lucide-react";
import LogoImg from "@/assets/images/isologo-blanco.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldBeTransparent = !scrolled && !isMenuOpen && location.pathname !== "/contacto";

  const headerBackground = location.pathname === "/contacto" ? "bg-[#F9EC56]" : shouldBeTransparent ? "bg-transparent" : "bg-white";

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${headerBackground} ${
        shouldBeTransparent ? "text-white" : "text-gray-800 shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={LogoImg}
                alt="Logo"
                className="w-16 h-10 mr-4 object-contain transition-all duration-300"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
              >
                <div className="flex items-center">
                  <Link
                    to={item.path}
                    className={`
                      px-4 py-2 transition-all duration-300 relative flex items-center font-bold
                      ${shouldBeTransparent ? "text-white hover:text-gray-200" : "text-gray-800 hover:text-yellow-300"}
                      ${item.name === "Contactanos" 
                        ? "bg-yellow-300 text-white hover:bg-yellow-400 rounded-xl mx-1" 
                        : ""
                      }
                      ${
                        location.pathname === item.path && item.name !== "Contactanos"
                          ? "text-yellow-300"
                          : ""
                      }
                      after:content-[''] after:absolute after:bottom-0 after:left-4
                      after:w-[calc(100%-2rem)] after:h-0.5
                      after:transition-all after:duration-300 after:transform
                      ${
                        location.pathname === item.path && item.name !== "Contactanos"
                          ? "after:scale-x-100 after:bg-yellow-300"
                          : "after:scale-x-0 after:bg-yellow-300 hover:after:scale-x-100"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                </div>
              </div>
            ))}
            
            <Link
              to="/login"
              className={`
                ml-4 px-4 py-2 rounded-md flex items-center
                transition-colors duration-200
                ${shouldBeTransparent 
                  ? "bg-yellow-300 text-white hover:bg-yellow-400" 
                  : "bg-yellow-300 text-white hover:bg-yellow-400"
                }
              `}
            >
              <LogIn size={16} className="mr-2" />
              Ingresar
            </Link>
          </nav>

          <div className="md:hidden flex items-center">
            <Link
              to="/login"
              className={`
                mr-4 p-2 rounded-full
                ${shouldBeTransparent ? "text-white" : "text-yellow-300"}
              `}
            >
              <LogIn size={20} />
            </Link>
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
            >
              {isMenuOpen ? (
                <X
                  size={24}
                  className={shouldBeTransparent ? "text-white" : "text-gray-800"}
                />
              ) : (
                <Menu
                  size={24}
                  className={shouldBeTransparent ? "text-white" : "text-gray-800"}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={toggleMenu}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium 
                  transition-colors duration-200
                  ${
                    item.name === "Contactanos"
                      ? "bg-yellow-300 text-white hover:bg-yellow-400 rounded-xl"
                      : location.pathname === item.path
                        ? "bg-yellow-300 text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-yellow-300"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
            
            <Link
              to="/login"
              onClick={toggleMenu}
              className={`
                flex items-center px-3 py-2 rounded-md text-base font-medium 
                transition-colors duration-200 bg-yellow-300 text-white
                hover:bg-yellow-400
              `}
            >
              <LogIn size={16} className="mr-2" />
              Ingresar al sistema
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

const menuItems = [
  { name: "Inicio", path: "/" },
  { name: "Nosotros", path: "/historia" },
  { name: "Proyectos", path: "/projects" },
  { name: "Servicios", path: "/services" },
  { name: "Contactanos", path: "/contacto" },
];

export default Header;