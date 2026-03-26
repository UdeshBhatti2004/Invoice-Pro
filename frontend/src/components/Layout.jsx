import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {}
      <aside className="hidden lg:block w-64 fixed top-0 left-0 h-full">
        <Sidebar />
      </aside>

      {}
      <AnimatePresence>
        {isOpen && (
          <>
            {}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {}
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-64 bg-blue-600 text-white z-50"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween" }}
            >
              <Sidebar onClose={() => setIsOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {}
      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        <Navbar onMenuClick={() => setIsOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
