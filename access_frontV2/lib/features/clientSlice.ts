import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () => {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
        const parsedAuth = JSON.parse(auth);
        console.log('parsedAuth', parsedAuth.access);
        return parsedAuth.access;
    }
    return null;
};

type Client = {
    id?: number;
    username: string;
    password?: string;
    role: string;
    station: Station;
};

type Station = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

export const clientApi = createApi({
    reducerPath: "clientApi",
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api/access/",
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getClients: builder.query<Client[], null>({
            query: () => "clients/",
        }),
        getStations: builder.query<Station[], null>({
            query: () => "stations/",
        }),
        addClient: builder.mutation<Client, { username: string; password: string; role: string; station: number | any }>({
            query: (client) => ({
                url: "clients/",
                method: "POST",
                body: client,
            }),
        }),
        updateClient: builder.mutation<Client, { id: number; username: string; role: string; station: number | any }>({
            query: ({ id, username, role, station }) => ({
                url: `clients/${id}/`,
                method: "PUT",
                body: { username, role, station },
            }),
        }),
        deleteClient: builder.mutation<void, number>({
            query: (id) => ({
                url: `clients/${id}/`,
                method: "DELETE",
            }),
        }),
        addStation: builder.mutation<Station, { name: string; latitude: number; longitude: number }>({
            query: (station) => ({
                url: "stations/",
                method: "POST",
                body: station,
            }),
        }),
        updateStation: builder.mutation<Station, { id: number; name: string; latitude: number; longitude: number }>({
            query: ({ id, name, latitude, longitude }) => ({
                url: `stations/${id}/`,
                method: "PATCH",
                body: { name, latitude, longitude },
            }),
        }),
        deleteStation: builder.mutation<void, number>({
            query: (id) => ({
                url: `stations/${id}/`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetClientsQuery,
    useAddClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
    useGetStationsQuery,
    useAddStationMutation,
    useUpdateStationMutation,
    useDeleteStationMutation
} = clientApi;
