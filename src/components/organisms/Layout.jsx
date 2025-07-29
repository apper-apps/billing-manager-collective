import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={closeMobileMenu}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative">
            <Sidebar isMobile onClose={closeMobileMenu} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header onMenuToggle={toggleMobileMenu} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;