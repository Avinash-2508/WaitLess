import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shopName = localStorage.getItem("shopName") || "WaitLess";
  const shopId = localStorage.getItem("shopId");

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('aside') && !e.target.closest('header')) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 lg:w-64 bg-white shadow-lg p-4 lg:p-6 flex-col border-r border-gray-200 fixed h-full">
        <Link 
          to={shopId ? `/owner/${shopId}` : "#"} 
          className="mb-4 text-xl lg:text-2xl font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          WaitLess
        </Link>
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm px-4 py-3 flex justify-between items-center border-b border-gray-200 sticky top-0 z-50">
        <Link 
          to={shopId ? `/owner/${shopId}` : "#"} 
          className="text-lg font-bold text-blue-600 hover:text-blue-700"
        >
          WaitLess
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl font-bold text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Mobile Sidebar Dropdown */}
      {menuOpen && (
        <aside className="md:hidden bg-white shadow-lg p-4 border-b border-gray-200 animate-slideDown">
          <Sidebar mobile />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-60 lg:ml-64 flex justify-center items-start md:items-center p-4 sm:p-6 lg:p-8 md:p-10 max-w-full overflow-x-hidden min-h-screen md:min-h-0">
        <div className="w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

