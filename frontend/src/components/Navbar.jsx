import { Link } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useState } from "react";
import Profile from "../pages/Profile"; 

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true); 
  };

  return (
    <>
      <nav className="w-full bg-white shadow-md sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            InvoicePro
          </Link>

          {}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <User size={20} />
              <span>Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {}
          <button className="lg:hidden text-blue-600" onClick={onMenuClick}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Navbar;
