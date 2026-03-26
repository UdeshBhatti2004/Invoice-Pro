import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Edit3, Save } from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../features/authApi";
import { toast } from "react-hot-toast";

const Profile = ({ onClose }) => {
  const { data, isLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
  });


  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        companyName: data.companyName || "",
      });
    }
    console.log("Profile data loaded:", data);
  }, [data]);


 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await updateProfile(formData).unwrap();

      console.log("Update response:", res); // add this
    console.log("formData being sent:", formData); // add this

      toast.success("Profile updated successfully!");

      setFormData({
  name: res.user?.name || formData.name,
  email: res.user?.email || formData.email,
  companyName: res.user?.companyName || formData.companyName,
});

      refetch();

      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile!");
    }
  };

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" /> Loading profile...
        </div>
      </div>
    );

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white text-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md relative mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {}
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
          My Profile
        </h2>

        {}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!editMode}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 mt-1 ${
                editMode
                  ? "border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none"
                  : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={!editMode}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 mt-1 ${
                editMode
                  ? "border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none"
                  : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              disabled={!editMode}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 mt-1 ${
                editMode
                  ? "border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none"
                  : "bg-gray-100"
              }`}
            />
          </div>
        </div>

        {}
        <div className="flex justify-end gap-3 mt-6">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit3 size={18} /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
