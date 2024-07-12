import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { User } from "@/types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api/access/",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.user?.access;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<User, { username: string; password: string }>({
            query: (credentials) => ({
                url: "clients/login/",
                method: "POST",
                body: credentials,
            }),
        }),
        refresh: builder.mutation<{ access: string }, { refresh: string }>({
            query: (refreshToken) => ({
                url: "token/refresh/",
                method: "POST",
                body: refreshToken,
            }),
        }),
    }),
});

authApi.enhanceEndpoints({});

export const { useLoginMutation, useRefreshMutation } = authApi;
