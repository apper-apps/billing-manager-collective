import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isMobile = false, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Invoices",
      href: "/",
      icon: "FileText",
      description: "Manage all invoices"
    },
    {
      name: "Clients", 
      href: "/clients",
      icon: "Users",
      description: "Client management"
    },
    {
      name: "Services",
      href: "/services", 
      icon: "Package",
      description: "Service catalog"
    }
  ];

  const sidebarClasses = cn(
    "bg-white border-r border-slate-200 h-screen flex flex-col shadow-lg",
    isMobile 
      ? "fixed left-0 top-0 z-50 w-64 transform transition-transform duration-300" 
      : "fixed left-0 top-0 w-64"
  );

  return (
    <motion.aside 
      className={sidebarClasses}
      initial={isMobile ? { x: "-100%" } : false}
      animate={isMobile ? { x: 0 } : false}
      exit={isMobile ? { x: "-100%" } : false}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Receipt" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Billing Manager</h2>
              <p className="text-xs text-slate-600">Invoice Management</p>
            </div>
          </div>
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                )}
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className={cn(
                  "text-xs opacity-75",
                  isActive ? "text-primary-100" : "text-slate-500"
                )}>
                  {item.description}
                </div>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-center">
          <p className="text-xs text-slate-500">
            v1.0.0 • Built for Small Business
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;