import { Link } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  BarChart2,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Profile from "../pages/Profile";

const Sidebar = ({ onClose }) => {
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (onClose) onClose(); 
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logout());
      navigate("/login");
      if (onClose) onClose();
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    
  };

  return (
    <>
      <div className="w-64 h-full bg-blue-600 text-white p-6 relative z-40">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">InvoicePro</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <X />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-blue-700 p-2 rounded"
          >
            <Home /> Dashboard
          </Link>

          <Link
            to="/invoices"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-blue-700 p-2 rounded"
          >
            <FileText /> Invoices
          </Link>

          <Link
            to="/clients"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-blue-700 p-2 rounded"
          >
            <Users /> Clients
          </Link>

          <Link
            to="/reports"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-blue-700 p-2 rounded"
          >
            <BarChart2 /> Reports
          </Link>

          {}
          <div className="lg:hidden mt-6 border-t border-blue-500 pt-4 flex flex-col gap-3">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 hover:bg-blue-700 p-2 rounded"
            >
              <User /> Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-300 hover:text-red-500 p-2 rounded"
            >
              <LogOut /> Logout
            </button>
          </div>
        </nav>
      </div>

      {}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Profile onClose={() => setShowProfile(false)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;
