import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
  try {
    const { clientName,clientEmail, amount, dueDate, status } = req.body;

    const newInvoice = new Invoice({
      clientName,
      clientEmail,
      amount,
      dueDate,
      status,
      createdBy: req.user.id,
    });
    await newInvoice.save();
    res
      .status(200)
      .json({ message: "Invoice created succesfully", invoice: newInvoice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating invoice", error: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user.id });
    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoices", error: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoice", error: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { clientName, amount, dueDate, status } = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { clientName, amount, dueDate, status },
      { new: true }
    );
    res.json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating invoice", error: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting invoice", error: error.message });
  }
};
