
import { apiSlice } from "../features/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    
    updateProfile: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          url: "/auth/profile",
          method: "PUT",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    
    getProfile: builder.query({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          url: "/auth/profile",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
} = authApi;
