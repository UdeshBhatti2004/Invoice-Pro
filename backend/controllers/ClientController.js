import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";

export const getClientsSummary = async (req, res) => {
  try {
    
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const summary = await Invoice.aggregate([
      
      { $match: { createdBy: userId } },

      
      {
        $group: {
          _id: { name: "$clientName", email: "$clientEmail" },
          totalBusiness: { $sum: "$amount" },
          totalDue: {
            $sum: {
              $cond: [{ $eq: ["$status", "Paid"] }, 0, "$amount"],
            },
          },
        },
      },

      
      {
        $project: {
          _id: 0,
          clientName: "$_id.name",
          clientEmail: "$_id.email",
          totalBusiness: 1,
          totalDue: 1,
        },
      },
      { $sort: { clientName: 1 } },
    ]);

    res.status(200).json(summary);
  } catch (err) {
    console.error("Client summary error:", err);
    res.status(500).json({ message: "Failed to fetch client summary" });
  }
};
