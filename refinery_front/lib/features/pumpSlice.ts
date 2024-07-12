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

type Pump = {
    id?: number;
    code: string;
    station: Station;
};

type Station = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

type Fuel = {
    id: number;
    type: string;
};

type PumpFuel = {
    id?: number;
    pump: number;
    fuel: number;
    price: number;
    stock: number;
};

type PumpWithFuels = {
    id: number;
    code: string;
    fuels: {
        fuel: Fuel;
        price: string;
        stock: string;
    }[];
};

export const pumpApi = createApi({
    reducerPath: "pumpApi",
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8001/api/",
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPumps: builder.query<Pump[], null>({
            query: () => "pumps/",
        }),
        getFuels: builder.query<Fuel[], null>({
            query: () => "fuels/",
        }),
        addPump: builder.mutation<Pump, { code: string; station: number | any }>({
            query: (pump) => ({
                url: "pumps/",
                method: "POST",
                body: pump,
            }),
        }),
        updatePump: builder.mutation<Pump, { id: number; code: string; station: number | any }>({
            query: ({ id, code, station }) => ({
                url: `pumps/${id}/`,
                method: "PUT",
                body: { code, station },
            }),
        }),
        deletePump: builder.mutation<void, number>({
            query: (id) => ({
                url: `pumps/${id}/`,
                method: "DELETE",
            }),
        }),
        getPumpsWithTypesFuelByStation: builder.query<PumpWithFuels[], number>({
            query: (stationId) => `pump-fuels/get_pumps__with_types_fuel_by_station/?station_id=${stationId}`,
        }),
        addPumpFuel: builder.mutation<PumpFuel, { pump: number; fuel: number; price: number; stock: number }>({
            query: (pumpFuel) => ({
                url: "pump-fuels/",
                method: "POST",
                body: pumpFuel,
            }),
        }),
        updatePumpFuel: builder.mutation<PumpFuel, { pump: number; fuel: number; price: number; stock: number }>({
            query: ({ pump, fuel, price, stock }) => ({
                url: `pump-fuels/edit_pumpfuel_by_pump_fuel_ids/`,
                method: "POST",
                body: { pump, fuel, price, stock },
            }),
        }),
        deletePumpFuel: builder.mutation<void, number>({
            query: (id) => ({
                url: `pump-fuels/${id}/`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetPumpsQuery,
    useAddPumpMutation,
    useUpdatePumpMutation,
    useDeletePumpMutation,
    useGetFuelsQuery,
    useGetPumpsWithTypesFuelByStationQuery,
    useAddPumpFuelMutation,
    useUpdatePumpFuelMutation,
    useDeletePumpFuelMutation,
} = pumpApi;
