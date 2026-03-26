import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      }),
    }),

    
    getRecentActivity: builder.query({
      query: () => ({
        url: "/dashboard/recent",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRecentActivityQuery } = dashboardApi;
