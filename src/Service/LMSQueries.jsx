import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./BaseURL";

const role = () =>
  JSON.parse(localStorage.getItem("auth-storage")).state.activeRole;
// Define a service using a base URL and expected endpoints
export const lmsQueries = createApi({
  reducerPath: "lmsQueries",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ["activeLeads", "leadProfile", "collectionProfile"],
  endpoints: (builder) => ({
    updateCollection: builder.mutation({
      query: ({ loanNo, data }) => ({
        url: `/collections/active/${loanNo}/?role=${role()}`,
        method: "PATCH",
        body: { data },
      }),
      providesTags: ["activeLeads", "leadProfile"],
    }),
    verifyPayment : builder.mutation({
        query: ({ loanNo, transactionId }) => ({
            url: `/accounts/payment/verify/${loanNo}/?transactionId=${transactionId}&role=accountExecutive`,
            method: "PATCH",
            // body: { data },
        }),
        invalidatesTags: ["collectionProfile"]
    }),
    addPayment: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/collections/updatePayment/${id}/?role=${role()}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["activeLeads"],
    }),
    activeLeads: builder.query({
      query: ({ page, limit }) => `/collections/active/?role=${role()}`,
      providesTags: ["activeLeads"],
    }),
    fetchActiveLead: builder.query({
      query: (loanNo) => `/collections/active/${loanNo}/?role=${role()}`,
      providesTags: ["activeLeads", "leadProfile"],
    }),

        pendingVerification: builder.query({
            query: (loanNo) =>  `/accounts/pendingPaymentVerification/${loanNo}/?role=${role()}`,
            providesTags:["collectionProfile"]
        }),
        verifyPendingLead: builder.mutation({
            query: ({ loanNo, utr, status }) => ({
                url: `/accounts/active/verify/${loanNo}/?role=${role()}`,
                method: "PATCH",
                body: { utr, status },
            }),
            invalidatesTags:["leadProfile","activeLeads"]
        }),
        closedLeads: builder.query({
            query: ({ page, limit }) =>
                `/collections/closed/?role=${role()}`,
            // providesTags: ["activeLeads"],
        }),
    }),
});
export const {
  useUpdateCollectionMutation,
  useAddPaymentMutation,
  useActiveLeadsQuery,
  useFetchActiveLeadQuery,
  usePendingVerificationQuery,
  useVerifyPendingLeadMutation,
  useClosedLeadsQuery,
  useVerifyPaymentMutation,
} = lmsQueries;
