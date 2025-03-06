import React, { createContext, useContext, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  BarChart2,
  LogOut,
  Menu,
  Tag,
  Layers,
  MapPin,
} from "lucide-react";

// Create context for sidebar state
const SidebarContext = createContext();

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [expandedItem, setExpandedItem] = useState(null);

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setIsCollapsed]);

  const toggleExpandItem = (title) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      title: "Orders",
      icon: <Users size={20} />,
      path: "/orders",
    },
    {
      title: "Products",
      icon: <ShoppingCart size={20} />,
      path: "/products",
    },
    {
      title: "Categories",
      icon: <Layers size={20} />,
      path: "/categories",
      submenu: [
        { title: "Main Categories", path: "/categories/main" },
        { title: "Subcategories", path: "/categories/sub" },
        { title: "Manage Hierarchy", path: "/categories/hierarchy" },
      ],
    },
    {
      title: "POS",
      icon: <MapPin size={20} />,
      path: "/pos",
      submenu: [
        { title: "Terminals", path: "/pos/terminals" },
        { title: "Transactions", path: "/pos/transactions" },
        { title: "Settings", path: "/pos/settings" },
      ],
    },
    {
      title: "Customers",
      icon: <BarChart2 size={20} />,
      path: "/customers",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
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
      <nav className="flex flex-col gap-2 p-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.submenu &&
              item.submenu.some(
                (subItem) => location.pathname === subItem.path
              ));
          const isExpanded = expandedItem === item.title;

          return (
            <div key={item.path} className="flex flex-col">
              {/* Main menu item */}
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 group relative cursor-pointer
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                onClick={() => {
                  if (item.submenu && !isCollapsed) {
                    toggleExpandItem(item.title);
                  } else if (!item.submenu) {
                    // Navigate to the path if it's a direct link
                    window.location.href = item.path;
                  }
                }}
              >
                <div
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-violet-600 dark:text-violet-400" : ""
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <>
                    <span
                      className={`text-sm font-medium transition-all duration-200 flex-1
                        ${isActive ? "translate-x-1" : ""}
                      `}
                    >
                      {item.title}
                    </span>
                    {item.submenu && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </>
                )}

                {isActive && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-violet-500 rounded-r-full" />
                )}
              </div>

              {/* Submenu items */}
              {!isCollapsed && item.submenu && isExpanded && (
                <div className="pl-10 mt-1 space-y-1">
                  {item.submenu.map((subItem) => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isSubActive
                              ? "bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        <span>{subItem.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
        <Sidebar />
        <main
          className={`flex-1 p-8 transition-all duration-300
            ${isCollapsed ? "ml-20" : "ml-64"}`}
        >
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default AdminSidebar;
