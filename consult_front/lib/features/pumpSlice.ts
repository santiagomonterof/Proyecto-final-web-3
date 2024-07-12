import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Fuel = {
    id: number;
    type: string;
};

type PumpFuel = {
    fuel: Fuel;
    price: string;
    stock: string;
};

type Station = {
    id: number;
    name: string;   
    latitude: number;
    longitude: number;
};

type Pump = {
    id: number;
    code: string;
    station: Station;
    fuels: PumpFuel[];
};

export const pumpApi = createApi({
    reducerPath: "pumpApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8001/api/",
    }),
    endpoints: (builder) => ({
        getPumpsWithFuels: builder.query<Pump[], void>({
            query: () => "pump-fuels/fuel_station/",
        }),
    }),
});

export const { useGetPumpsWithFuelsQuery } = pumpApi;
