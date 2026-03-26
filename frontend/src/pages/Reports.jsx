import React from "react";
import { useGetInvoicesQuery } from "../features/invoiceApi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Reports = () => {
  const { data: invoices = [] } = useGetInvoicesQuery();

  const totalInvoices = invoices.length;
  const totalPaid = invoices.filter((inv) => inv.status === "Paid").length;
  const totalPending = invoices.filter((inv) => inv.status === "Pending").length;

  const totalAmount = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((acc, inv) => acc + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((acc, inv) => acc + inv.amount, 0);

  const invoiceStatusData = [
    { name: "Paid", value: totalPaid },
    { name: "Pending", value: totalPending },
  ];

  const revenueData = [
    { name: "Paid", amount: paidAmount },
    { name: "Pending", amount: pendingAmount },
  ];

  const monthlyData = invoices.reduce((acc, inv) => {
    const month = new Date(inv.dueDate).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((m) => m.name === month);
    if (existing) {
      existing.amount += inv.amount;
    } else {
      acc.push({ name: month, amount: inv.amount });
    }
    return acc;
  }, []);

  const COLORS = ["#00C49F", "#FFBB28"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-md p-2 shadow-sm text-xs">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-gray-700">
              {entry.name}: {entry.value || entry.payload.amount}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-white min-h-screen rounded-2xl">
      <h1 className="text-2xl font-semibold mb-4">Reports & Analytics</h1>

      {}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded-lg shadow-sm bg-white">
          <h3 className="text-gray-500 text-sm">Total Invoices</h3>
          <p className="text-xl font-semibold">{totalInvoices}</p>
          <h3 className="text-gray-500 text-sm mt-2">Total Amount</h3>
          <p className="text-xl font-semibold">₹{totalAmount.toFixed(2)}</p>
        </div>

        <div className="p-3 rounded-lg shadow-sm bg-white">
          <h3 className="text-gray-500 text-sm">Paid Invoices</h3>
          <p className="text-xl font-semibold">{totalPaid}</p>
          <h3 className="text-gray-500 text-sm mt-2">Paid Amount</h3>
          <p className="text-xl font-semibold">₹{paidAmount.toFixed(2)}</p>
        </div>

        <div className="p-3 rounded-lg shadow-sm bg-white">
          <h3 className="text-gray-500 text-sm">Pending Invoices</h3>
          <p className="text-xl font-semibold">{totalPending}</p>
          <h3 className="text-gray-500 text-sm mt-2">Pending Amount</h3>
          <p className="text-xl font-semibold">₹{pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      {}
      <div className="grid lg:grid-cols-2 gap-6">
        {}
        <div className="p-3 rounded-lg shadow-sm bg-white">
          <h3 className="text-base font-semibold mb-2">Invoice Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={invoiceStatusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" barSize={40} radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {}
        <div className="p-3 rounded-lg shadow-sm bg-white">
          <h3 className="text-base font-semibold mb-2">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {revenueData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {}
        <div className="lg:col-span-2 p-3 rounded-lg shadow-sm bg-white">
          <h3 className="text-base font-semibold mb-2">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
