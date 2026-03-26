import { useState } from "react";
import { useLoginUserMutation } from "../features/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Wallet } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password }).unwrap();
      dispatch(setCredentials({ token: data.token }));
      navigate("/");
    } catch (err) {
      setError(err?.data?.message || "Login failed");
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
            Simplify Your Finances 💼
          </motion.h2>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg opacity-90 mb-8 leading-relaxed"
          >
            Track invoices, manage clients, and gain real-time financial
            insights — all in one smart dashboard.
          </motion.p>

          <div className="flex justify-center gap-6 text-4xl">
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="bg-white/20 p-4 rounded-2xl backdrop-blur-md"
            >
              <Wallet />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="bg-white/20 p-4 rounded-2xl backdrop-blur-md"
            >
              <TrendingUp />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="bg-white/20 p-4 rounded-2xl backdrop-blur-md"
            >
              <Shield />
            </motion.div>
          </div>

          <p className="mt-10 text-sm opacity-75 italic">
            “Where every transaction tells a story of growth.”
          </p>
        </motion.div>
      </div>

      {}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white/70 backdrop-blur-sm">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Access your{" "}
            <span className="text-blue-600 font-semibold">Finance Portal</span>
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-md">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg mb-4 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg mb-6 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Empower your business with clarity & confidence.
          </p>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Sign up
            </span>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
