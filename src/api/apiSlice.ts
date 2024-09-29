import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type UserData = {
  name: string;
  email: string;
};
type StatusResponse = {
  status: 'PENDING' | 'SUCCESS';
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3010',
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<void, UserData>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    checkStatus: builder.query<StatusResponse, void>({
      query: () => '/status',
    }),
  }),
});

export const { useRegisterUserMutation, useLazyCheckStatusQuery } = apiSlice;
