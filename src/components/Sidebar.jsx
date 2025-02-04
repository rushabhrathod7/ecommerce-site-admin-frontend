import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  BarChart2,
  LogOut,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
    {
      title: "Products",
      icon: <ShoppingCart size={20} />,
      path: "/products",
    },
    {
      title: "Analytics",
      icon: <BarChart2 size={20} />,
      path: "/admin/analytics",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"}
        bg-gray-50 dark:bg-gray-900
        shadow-[1px_0_5px_0_rgba(0,0,0,0.05)]
        dark:shadow-[1px_0_5px_0_rgba(0,0,0,0.3)]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold bg-linear-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Admin
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-900
            hover:bg-gray-100 dark:hover:bg-gray-800
            active:bg-gray-200 dark:active:bg-gray-700
            transition-all duration-200
            ${isCollapsed ? "w-full flex justify-center" : ""}`}
          title="Toggle sidebar (Ctrl + B)"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group relative
                ${isCollapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <div
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-violet-600 dark:text-violet-400" : ""
                }`}
              >
                {item.icon}
              </div>

              {!isCollapsed && (
                <span
                  className={`text-sm font-medium transition-all duration-200
                  ${isActive ? "translate-x-1" : ""}
                `}
                >
                  {item.title}
                </span>
              )}

              {isActive && (
                <div className="absolute inset-y-0 left-0 w-1 bg-violet-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer/Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-gray-600 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800
            hover:text-red-600 dark:hover:text-red-400
            transition-all duration-200
            ${isCollapsed ? "justify-center" : ""}`}
          onClick={() => console.log("Logout clicked")}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
