// components/Sidebar/Sidebar.jsx
import React, { useState } from "react";
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
      path: "/admin/products",
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
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
        bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100
        border-r border-gray-700/50 shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700/50">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Admin
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-gray-700/50 transition-colors
            ${isCollapsed ? "w-full flex justify-center" : ""}`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-700/60 text-white font-medium shadow-md"
                    : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                }
                ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className={`${isActive ? "text-blue-400" : ""}`}>
                {item.icon}
              </div>
              {!isCollapsed && <span className="text-sm">{item.title}</span>}
              {!isCollapsed && isActive && (
                <div className="absolute left-0 w-1 h-6 bg-blue-400 rounded-r-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer/Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
            text-gray-300 hover:bg-gray-700/30 hover:text-white transition-colors
            ${isCollapsed ? "justify-center" : ""}`}
          onClick={() => console.log("Logout clicked")}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
