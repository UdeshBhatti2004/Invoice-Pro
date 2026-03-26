import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CreateEditInvoiceModal = ({ show, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    amount: "",
    dueDate: "",
    status: "Pending",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        clientName: editData.clientName || "",
        clientEmail: editData.clientEmail || "",
        amount: editData.amount || "",
        dueDate: editData.dueDate?.split("T")[0] || "",
        status: editData.status || "Pending",
      });
    } else {
      setFormData({
        clientName: "",
        clientEmail: "",
        amount: "",
        dueDate: "",
        status: "Pending",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={onClose} 
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editData ? "Edit Invoice" : "Create Invoice"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Client Email</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editData ? "Update Invoice" : "Create Invoice"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateEditInvoiceModal;
