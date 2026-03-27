import { GoogleGenerativeAI } from "@google/generative-ai";
import Invoice from "../models/Invoice.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Queue, Worker } from "bullmq";
import redisConnection from "../config/redis.js";

dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.error("Transporter config error:", err);
  else console.log("Email transporter ready");
});

const emailQueue = new Queue("emailQueue", { connection: redisConnection });

export async function sendEmailReminder(invoice) {
  const { clientName, clientEmail, amount, dueDate, status, createdBy } = invoice;

  const businessName = createdBy?.companyName || createdBy?.name || "Your Company";
  
  if (!clientEmail) {
    console.log(`No email for ${clientName}, skipping.`);
    return;
  }

  const prompt =
    status === "Paid"
      ? `Write a professional thank-you email to ${clientName}.
         Confirm that we have received the payment of ₹${amount}.
         Do NOT include placeholders or bracket text.
         End the email with: Regards, ${businessName}`
      : `Write a professional payment reminder email to ${clientName}.
         The invoice amount is ₹${amount} and the due date is ${dueDate}.
         Do NOT use placeholders or bracket text.
         End the email with: Regards, ${businessName}`;


  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const emailBody = result.response.text();

  const mailOptions = {
    from: `"Invoice App" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: status === "Paid"
      ? `Thank you for your payment, ${clientName}!`
      : `Payment Reminder: ₹${amount} due on ${dueDate}`,
    text: emailBody,
  };


  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${clientEmail} — ID: ${info.messageId}`);
}

export const createInvoiceWithAI = async (req, res) => {
  try {
    const { prompt, clientEmail } = req.body;
    const userId = req.user.id;

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    if (!clientEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Client email is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const aiResponse = await model.generateContent(`
  You are a professional invoice generator AI.
  Based on the given user input, generate a valid JSON array (even if there is only one invoice).

  Each invoice must include these keys:
  - clientName (string)
  - amount (number)
  - dueDate (in ISO format YYYY-MM-DD)
  - description (string)
  - status ("Pending")

  ⚡ Important:
  - If the user mentions multiple invoices, make sure EACH has its own correct due date 
    based on the natural language given (e.g., "tomorrow", "in 7 days", "next Monday").
  - Interpret all natural dates **individually** for each invoice, not globally.
  - Use today's date as reference: ${new Date().toISOString().split("T")[0]}.
  - Do NOT return past dates unless explicitly asked.
  - Return ONLY a valid JSON array (no text or markdown).

  Example output:
  [
    {"clientName": "John Doe", "amount": 2500, "dueDate": "2025-11-11", "description": "Web development work", "status": "Pending"}
  ]

  Prompt: ${prompt}
`);

    const text = aiResponse.response.text();
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("AI response did not return a valid JSON array");
    }

    const jsonString = text.slice(jsonStart, jsonEnd);
    const invoices = JSON.parse(jsonString);

    
    const invoiceArray = Array.isArray(invoices) ? invoices : [invoices];

    
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    
    const preparedInvoices = invoiceArray.map((inv) => {
      let due = new Date(inv.dueDate);

      
      if (isNaN(due.getTime()) || due < today || due > maxDate) {
        due = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); 
      }

      return {
        ...inv,
        clientEmail,
        createdBy: userId,
        dueDate: due.toISOString().split("T")[0],
        status: inv.status || "Pending",
      };
    });

    
    const savedInvoices = await Invoice.insertMany(preparedInvoices);

    return res.status(201).json({
      success: true,
      message: `${savedInvoices.length} AI invoice(s) created successfully`,
      invoices: savedInvoices,
    });
  } catch (error) {
    console.error(" AI Invoice Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating invoices with AI",
      error: error.message,
    });
  }
};


export const generateReminderEmail = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await Invoice.findById(invoiceId).populate("createdBy");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    
    await emailQueue.add("sendEmail", invoice);
    console.log(`📬 Enqueued single reminder for: ${invoice.clientName}`);

    res.json({
      success: true,
      message: "Reminder email enqueued successfully.",
    });
  } catch (error) {
    console.error(" generateReminderEmail error:", error);
    res.status(500).json({ message: "Error sending reminder" });
  }
};




export const generateAllReminders = async (req, res) => {
  try {
    console.log(" Generating all reminders and thank-you emails...");
    
    const invoices = await Invoice.find({
      status: { $in: ["Pending", "Paid"] },
    }).populate("createdBy");

    if (!invoices.length)
      return res.json({ success: false, message: "No invoices found." });

    for (const invoice of invoices) {
      await emailQueue.add("sendEmail", invoice);
    }

    console.log(` Enqueued ${invoices.length} jobs (reminders + thank-you)`);
    res.json({
      success: true,
      message: `${invoices.length} emails (reminders + thank-you) enqueued successfully.`,
    });
  } catch (error) {
    console.error(" Error generating all reminders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enqueue reminder emails.",
      error: error.message,
    });
  }
};




export const getAIDashboardInsights = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    const recentInvoices = invoices.slice(0, 5);

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const paid = invoices.filter((i) => i.status === "Paid").length;
    const unpaid = invoices.filter((i) => i.status !== "Paid").length;

    const prompt = `
      You are a helpful finance assistant.
      Given these stats:
      - totalInvoices: ${totalInvoices}
      - totalAmount: ${totalAmount}
      - paidInvoices: ${paid}
      - unpaidInvoices: ${unpaid}

      Write a short (2-3 sentence) insight about the user's invoice situation
      and provide 2 quick improvement suggestions.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    res.json({
      stats: { totalInvoices, totalAmount, paid, unpaid },
      insight: insight.trim(),
      recentInvoices, 
    });
  } catch (error) {
    console.error("getAIDashboardInsights error:", error);
    res.status(500).json({
      message: "Error generating AI insights",
      error: error.message,
    });
  }
};

const startEmailWorker = async () => {
  try {
    const worker = new Worker(
      "emailQueue",
      async (job) => {
        console.log(`Processing job for: ${job.data.clientName}`);
        await sendEmailReminder(job.data);
        console.log(`Finished job for: ${job.data.clientName}`);
      },
      {
        connection: redisConnection,
      }
    );

    worker.on("completed", (job) => {
      console.log(`Email sent successfully to: ${job.data.clientName}`);
    });

    worker.on("failed", (job, err) => {
      console.error(
        `Failed to send email to ${job.data.clientName}: ${err.message}`
      );
    });

    console.log("BullMQ Email Worker is running within backend process");
  } catch (err) {
    console.error("Failed to start internal worker:", err);
  }
};

startEmailWorker();
