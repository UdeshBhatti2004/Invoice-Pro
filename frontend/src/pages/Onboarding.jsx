
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUpdateProfileMutation } from "../features/authApi";

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    role: "",
    preferredCurrency: "",
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      await updateProfile(formData).unwrap();
      toast.success("Profile completed successfully ");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Complete Your Profile 💼
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input

            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Your Role (e.g., Finance Manager)"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />

          <select
            name="preferredCurrency"
            value={formData.preferredCurrency}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Currency</option>
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {isLoading ? "Saving..." : "Complete Onboarding"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
