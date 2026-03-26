import React from "react";
import { motion } from "framer-motion";
import { useUpdateInvoiceMutation } from "../features/invoiceApi";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";

const InvoiceModal = ({ isOpen, onClose, invoice }) => {
  const [updateInvoice] = useUpdateInvoiceMutation();

  if (!isOpen) return null;

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  
  const handleMarkAsPaid = async () => {
    try {
      const todayIST = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const isoIST = new Date(todayIST).toISOString();

      await updateInvoice({
        id: invoice._id,
        data: { status: "Paid", paidDate: isoIST },
      }).unwrap();

      toast.success("Invoice marked as paid today!");
      onClose();
    } catch (err) {
      toast.error("Failed to mark as paid!");
      console.error(err);
    }
  };

  
  const handleDownloadInvoice = () => {
    try {
      const doc = new jsPDF();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("INVOICE", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice ID: ${invoice._id}`, 20, 35);
      doc.text(`Client Name: ${invoice.clientName}`, 20, 45);
      doc.text(`Client Email: ${invoice.clientEmail || "N/A"}`, 20, 55);
      doc.text(`Amount: ₹${invoice.amount}`, 20, 65);
      doc.text(`Status: ${invoice.status}`, 20, 75);
      doc.text(`Created On: ${formatDateTime(invoice.createdAt)} IST`, 20, 85);

      if (invoice.status === "Paid") {
        doc.text(
          `Paid On: ${
            invoice.paidDate
              ? formatDateTime(invoice.paidDate)
              : formatDateTime(new Date())
          } IST`,
          20,
          95
        );
      } else {
        doc.text(`Due Date: ${formatDateTime(invoice.dueDate)} IST`, 20, 95);
      }

      doc.text("Description:", 20, 110);
      doc.text(invoice.description || "—", 20, 120, { maxWidth: 170 });

      doc.line(20, 130, 190, 130);
      doc.text("Thank you for your business!", 105, 140, { align: "center" });

      doc.save(`Invoice_${invoice.clientName || "Client"}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download invoice!");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-md relative"
      >
        {}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {}
        <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center border-b pb-2">
          Invoice Details
        </h2>

        {}
        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <strong>Client Name:</strong> <br /> {invoice?.clientName}
          </p>

          <p>
            <strong>Client Email:</strong> <br /> {invoice?.clientEmail || "N/A"}
          </p>

          <p>
            <strong>Amount:</strong> <br /> ₹{invoice?.amount}
          </p>

          <p>
            <strong>Created On:</strong> <br />
            {formatDateTime(invoice?.createdAt)} IST
          </p>

          {invoice?.status === "Paid" ? (
            <p>
              <strong>Paid On:</strong> <br />
              {invoice?.paidDate
                ? formatDateTime(invoice.paidDate)
                : formatDateTime(new Date())}{" "}
              IST
            </p>
          ) : (
            <p>
              <strong>Due Date:</strong> <br />
              {formatDateTime(invoice?.dueDate)} IST
            </p>
          )}

          <p>
            <strong>Status:</strong> <br />
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                invoice?.status === "Paid"
                  ? "bg-green-100 text-green-700"
                  : invoice?.status === "Overdue"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {invoice?.status}
            </span>
          </p>

          <p>
            <strong>Description:</strong> <br /> {invoice?.description || "—"}
          </p>
        </div>

        {}
        <div className="mt-5 flex justify-center gap-3">
          {}
          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Download Invoice
          </button>

          {}
          {invoice?.status !== "Paid" && (
            <button
              onClick={handleMarkAsPaid}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InvoiceModal;
  