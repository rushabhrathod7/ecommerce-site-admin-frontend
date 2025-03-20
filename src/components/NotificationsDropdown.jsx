import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  // Sample notifications data
  const notifications = [
    { id: 1, text: "New order #1234 received", time: "2 min ago", isNew: true },
    {
      id: 2,
      text: "Product X is low in stock",
      time: "1 hour ago",
      isNew: true,
    },
    {
      id: 3,
      text: "3 new user registrations",
      time: "3 hours ago",
      isNew: false,
    },
    {
      id: 4,
      text: "Monthly sales report ready",
      time: "1 day ago",
      isNew: false,
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 rounded-full dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Notifications"
      >
        <Bell size={20} />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Notifications dropdown */}
      {isOpen && (
        <div className="absolute right-0 w-80 mt-2 bg-white rounded-lg shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Notifications
              </h3>
              <Link
                to="/notifications"
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {notification.text}
                      {notification.isNew && (
                        <span className="ml-2 text-xs font-semibold text-red-500">
                          New
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
