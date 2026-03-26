import { apiSlice } from "./apiSlice";

export const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getInvoices: builder.query({
      query: () => "/invoice",
      providesTags: ["Invoice"],
    }),

    
    createInvoice: builder.mutation({
      query: (data) => ({
        url: "/invoice/createInvoice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),

    
    createInvoiceWithAi: builder.mutation({
      query: (data) => ({
        url: "/ai/createInvoiceWithAi",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),

    
    getAIDashboardInsights: builder.query({
      query: () => "/ai/getAIDashboardInsights",
      providesTags: ["Invoice"],
    }),

    
    updateInvoice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/invoice/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),

    
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),

    
    sendReminder: builder.mutation({
      query: (invoiceId) => ({
        url: "/ai/generateReminder",
        method: "POST",
        body: { invoiceId },
      }),
    }),

    
    sendAllReminders: builder.mutation({
      query: () => ({
        url: "/ai/generateAllReminders",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useCreateInvoiceWithAiMutation,
  useGetAIDashboardInsightsQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useSendReminderMutation,
  useSendAllRemindersMutation,
} = invoiceApi;
