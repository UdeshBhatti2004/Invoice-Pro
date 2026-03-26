import { motion } from "framer-motion";
import { BarChart3, CheckCircle, Clock, FileText } from "lucide-react";
import {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
} from "../features/dashboardApi.js";
import { useGetProfileQuery } from "../features/authApi.js"; 
import { startCase } from "lodash";

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const {
    data: recentData,
    isLoading: isRecentLoading,
    isError: isRecentError,
  } = useGetRecentActivityQuery();

  
  const { data: profile } = useGetProfileQuery();

  const recentInvoices = Array.isArray(recentData)
    ? recentData
    : recentData?.recentInvoices || [];

  
  const userName =
    profile?.name || profile?.email?.split("@")[0] || "User";

  if (isLoading || isRecentLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  if (isError || isRecentError)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Failed to load dashboard data 😞
      </div>
    );

  const { totalInvoices, paidInvoices, unpaidInvoices, totalAmount } = data || {};

  const stats = [
    {
      title: "Total Invoices",
      value: totalInvoices || 0,
      icon: <FileText size={28} />,
      color: "text-blue-600",
    },
    {
      title: "Paid Invoices",
      value: paidInvoices || 0,
      icon: <CheckCircle size={28} />,
      color: "text-green-600",
    },
    {
      title: "Pending Invoices",
      value: unpaidInvoices || 0,
      icon: <Clock size={28} />,
      color: "text-yellow-600",
    },
    {
      title: "Total Amount",
      value: totalAmount ? `₹${totalAmount}` : "₹0",
      icon: <BarChart3 size={28} />,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s an overview of your invoices and activity.
        </p>
      </motion.div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {item.value}
              </h3>
            </div>
            <div className={`${item.color}`}>{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>

        {recentInvoices.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentInvoices.map((invoice) => (
              <li key={invoice._id} className="py-3 flex justify-between">
                <div>
                  <p className="text-gray-800 font-medium">
                    {startCase(invoice.clientName?.toLowerCase() || "")}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{invoice.amount} — {invoice.status}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No recent invoices found. Create one to get started.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
