
import { useDispatch } from "react-redux";
import { logout } from "../features/authapi/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    navigate("/login"); 
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 font-medium hover:underline"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
