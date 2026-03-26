import Invoice from "../models/Invoice.js";

export const getDashboardStats = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user.id });

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoices = invoices.filter((inv) => inv.status === "Paid").length;
    const unpaidInvoices = invoices.filter(
      (inv) => inv.status !== "Paid"
    ).length;

    return res.status(200).json({
      totalInvoices,
      totalAmount,
      paidInvoices,
      unpaidInvoices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

export const getRecentInvoices = async (req, res) => {
  try {
    const recentInvoices = await Invoice.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 }) 
      .limit(5)
      .select("clientName amount status createdAt"); 

    res.status(200).json({
      success: true,
      recentInvoices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recent invoices",
      error: error.message,
    });
  }
};


