import { useState } from "react";
import { motion } from "framer-motion";
import { useRegisterUserMutation } from "../features/authApi";
import { useNavigate, Link } from "react-router-dom";
import { FileText, BarChart3, UserPlus } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const res = await registerUser(formData).unwrap();

      
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      
      alert("Signup successful! Please complete onboarding.");
      navigate("/onboarding");
    } catch (error) {
      alert(error?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 relative overflow-hidden">
      {}
      <div className="absolute top-[-5rem] right-[-5rem] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5rem] left-[-5rem] w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl animate-pulse" />

      {}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 text-white justify-center items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center p-10 max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg"
        >
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Build Your Invoice System 
          </motion.h2>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg opacity-90 mb-8 leading-relaxed"
          >
            Create your account and manage clients, track invoices, and simplify your workflow — all in one place.
          </motion.p>

          <div className="flex justify-center gap-6 text-4xl">
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="bg-white/20 p-4 rounded-2xl backdrop-blur-md"
            >
              <FileText />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="bg-white/20 p-4 rounded-2xl backdrop-blur-md"
            >
              <BarChart3 />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="bg-white/20 p-4 rounded-2xl backdrop-blur-md"
            >
              <UserPlus />
            </motion.div>
          </div>

          <p className="mt-10 text-sm opacity-75 italic">
            “Your billing, simplified and automated.”
          </p>
        </motion.div>
      </div>

      {}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
            Create Account ✨
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Start managing your{" "}
            <span className="text-blue-600 font-semibold">Invoices Efficiently</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg outline-none transition-all bg-white/80"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg outline-none transition-all bg-white/80"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg outline-none transition-all bg-white/80"
              required
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
