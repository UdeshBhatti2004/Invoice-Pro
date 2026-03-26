import React from "react";
import { useGetClientsQuery } from "../features/clientApi";
import { motion } from "framer-motion";
import { Loader2, Mail, User, IndianRupee } from "lucide-react";
import _ from "lodash";

const Clients = () => {
  const { data, isLoading, error } = useGetClientsQuery();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={28} />
        <p className="ml-2 text-gray-600">Loading clients...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10">
        Failed to fetch client data!
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Clients Overview
      </h2>

      {data && data.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="text-blue-600" size={22} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {_.startCase(client.clientName)}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Mail size={14} className="mr-1" /> {client.clientEmail}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-gray-700 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Business</span>
                  <span className="font-medium flex items-center">
                    <IndianRupee size={14} className="mr-1 text-gray-600" />
                    {client.totalBusiness}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Total Due</span>
                  <span
                    className={`font-semibold flex items-center ${
                      client.totalDue > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    <IndianRupee size={14} className="mr-1" />
                    {client.totalDue}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 italic mt-10">
          No client data available.
        </div>
      )}
    </motion.div>
  );
};

export default Clients;
