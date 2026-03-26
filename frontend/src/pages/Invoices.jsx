import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceMutation,
  useSendReminderMutation,
  useSendAllRemindersMutation,
  useCreateInvoiceWithAiMutation,
} from "../features/invoiceApi";
import { toast } from "react-hot-toast";
import { Plus, Mail, Trash2, Edit2, Send, Sparkles, Loader2 } from "lucide-react";
import InvoiceModal from "../components/InvoiceModal";
import CreateEditInvoiceModal from "../components/CreateEditInvoiceModal";
import { startCase } from "lodash";

const InvoicePage = () => {
  const { data: invoices, isLoading, refetch } = useGetInvoicesQuery();
  const [createInvoice] = useCreateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [sendReminder] = useSendReminderMutation();
  const [sendAllReminders] = useSendAllRemindersMutation();
  const [createInvoiceWithAi, { isLoading: isAiLoading }] = useCreateInvoiceWithAiMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiEmail, setAiEmail] = useState("");

  const [editData, setEditData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSave = async (formData) => {
    try {
      if (formData.clientName) {
        formData.clientName = startCase(formData.clientName.toLowerCase());
      }

      if (editData) {
        await updateInvoice({ id: editData._id, data: formData }).unwrap();
        toast.success("Invoice updated successfully!");
      } else {
        await createInvoice(formData).unwrap();
        toast.success("Invoice created successfully!");
      }
      refetch();
      setShowCreateModal(false);
      setEditData(null);
    } catch (err) {
      console.error(" Error saving invoice:", err);
      toast.error("Error saving invoice!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id).unwrap();
        toast.success("Invoice deleted successfully!");
        refetch();
      } catch (err) {
        console.error(" Error deleting invoice:", err);
        toast.error("Error deleting invoice!");
      }
    }
  };

  const handleSendEmail = async (id) => {
    try {
      await sendReminder(id).unwrap();
      toast.success("Email sent successfully!");
    } catch (err) {
      console.error(" Error sending email:", err);
      toast.error("Failed to send email!");
    }
  };

  const handleSendAllReminders = async () => {
    try {
      await sendAllReminders().unwrap();
      toast.success("All emails sent successfully!");
    } catch (err) {
      console.error(" Error sending all reminders:", err);
      toast.error("Failed to send all emails!");
    }
  };

  const handleCreateWithAi = async () => {
    if (!aiText.trim()) {
      toast.error("Please enter a description or prompt!");
      return;
    }
    if (!aiEmail.trim()) {
      toast.error("Client email is required!");
      return;
    }

    try {
      const res = await createInvoiceWithAi({
        prompt: aiText,
        clientEmail: aiEmail,
      }).unwrap();

      if (res?.clientName) {
        res.clientName = startCase(res.clientName.toLowerCase());
      }

      toast.success("AI invoice created successfully!");
      setShowAiModal(false);
      setAiText("");
      setAiEmail("");
      refetch();
    } catch (err) {
      console.error(" Error generating AI invoice:", err);
      toast.error("Failed to create invoice with AI!");
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading invoices...</p>;

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-blue-600">Invoices</h1>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} /> Create Invoice
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Sparkles size={18} /> Create with AI
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSendAllReminders}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Send size={18} /> Send All Emails
          </motion.button>
        </div>
      </motion.div>

      {}
      {(!invoices || invoices.length === 0) && (
        <p className="text-center text-gray-500 mt-20 text-lg">
             No invoices yet — create one to get started!
        </p>
      )}

      {}
      {invoices?.length > 0 && (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          {invoices.map((invoice, index) => (
            <motion.div
              key={invoice._id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => {
                setSelectedInvoice(invoice);
                setShowViewModal(true);
              }}
              className="p-5 rounded-xl shadow-md bg-white cursor-pointer transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {startCase(invoice.clientName?.toLowerCase() || "")}
              </h2>

              <div className="space-y-1 text-gray-700 text-sm">
                <p>
                  <span className="font-medium">Amount:</span> ₹{invoice.amount}
                </p>

                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`${
                      invoice.status === "Paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    } font-semibold`}
                  >
                    {invoice.status}
                  </span>
                </p>

                <p>
                  <span className="font-medium">Created On:</span>
                  <br />
                  {new Date(invoice.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  IST
                </p>

                <p>
                  <span className="font-medium">
                    {invoice.status === "Paid" ? "Paid On:" : "Due On:"}
                  </span>
                  <br />
                  {new Date(invoice.dueDate).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  IST
                </p>
              </div>

              <div
                className="flex justify-between items-center mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleSendEmail(invoice._id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Mail size={18} />
                  {invoice.status === "Paid"
                    ? "Thank You Email"
                    : "Send Reminder"}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditData(invoice);
                      setShowCreateModal(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {}
      <InvoiceModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        invoice={selectedInvoice}
      />

      {showCreateModal && (
        <CreateEditInvoiceModal
          show={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
          editData={editData}
        />
      )}

      {showAiModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-purple-600">
              Create Invoice with AI
            </h2>
            <textarea
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              placeholder="Describe the invoice (e.g., Generate an invoice for Priya Sharma for ₹2000 due next week for web design)"
              className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
              rows="5"
            ></textarea>
            <input
              type="email"
              value={aiEmail}
              onChange={(e) => setAiEmail(e.target.value)}
              placeholder="Client Email (required)"
              className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAiModal(false)}
                disabled={isAiLoading}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWithAi}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Generate
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InvoicePage;
