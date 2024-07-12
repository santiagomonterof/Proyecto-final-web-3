import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const getToken = () => {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
        const parsedAuth = JSON.parse(auth);
        console.log('parsedAuth', parsedAuth.access);
        return parsedAuth.access;
    }
    return null;
};
export const salesApi = createApi({
    reducerPath: 'salesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8001/api/',
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSales: builder.query({
            query: () => 'sales/',
        }),
        addSale: builder.mutation({
            query: (sale) => ({
                url: 'sales/',
                method: 'POST',
                body: sale,
            }),
        }),
        updateSale: builder.mutation({
            query: ({ id, ...sale }) => ({
                url: `sales/${id}/`,
                method: 'PUT',
                body: sale,
            }),
        }),
        deleteSale: builder.mutation({
            query: (id) => ({
                url: `sales/${id}/`,
                method: 'DELETE',
            }),
        }),
        getPumps: builder.query({
            query: () => 'pumps/',
        }),
        getFuels: builder.query({
            query: () => 'fuels/',
        }),
    }),
});

export const {
    useGetSalesQuery,
    useAddSaleMutation,
    useUpdateSaleMutation,
    useDeleteSaleMutation,
    useGetPumpsQuery,
    useGetFuelsQuery,
} = salesApi;
