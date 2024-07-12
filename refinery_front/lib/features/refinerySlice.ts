import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
        const parsedAuth = JSON.parse(auth);
        return parsedAuth.access;
    }
    return null;
};

type Truck = {
    longitude: any;
    latitude: any;
    id: number;
    name: string;
    license_plate: string;
    assigned_driver: string | null;
};

type FuelType = {
    id: number;
    name: string;
};

type Route = {
    id: number;
    date: string;
    name: string;
    truck: Truck;
    fuel_quantity: number;
    fuel_type: FuelType;
    fuel_price_per_liter: number;
    completed: boolean;
};

type FuelStation = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    needs_fuel: boolean;
};

type RouteStation = {
    id: number;
    route: number;
    station: FuelStation;
    fuel_to_deliver: number;
    delivered: boolean;
};

export const refineryApi = createApi({
    reducerPath: 'refineryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8002/api/',
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTrucks: builder.query<Truck[], void>({
            query: () => 'trucks/',
        }),
        addTruck: builder.mutation<Truck, Partial<Truck>>({
            query: (truck) => ({
                url: 'trucks/',
                method: 'POST',
                body: truck,
            }),
        }),
        updateTruck: builder.mutation<Truck, Partial<Truck>>({
            query: ({ id, ...patch }) => ({
                url: `trucks/${id}/`,
                method: 'PUT',
                body: patch,
            }),
        }),
        deleteTruck: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `trucks/${id}/`,
                method: 'DELETE',
            }),
        }),
        getFuelTypes: builder.query<FuelType[], void>({
            query: () => 'fueltypes/',
        }),
        getRoutes: builder.query<Route[], void>({
            query: () => 'routes/',
        }),
        addRoute: builder.mutation<Route, Partial<Route>>({
            query: (route) => ({
                url: 'routes/',
                method: 'POST',
                body: route,
            }),
        }),
        updateRoute: builder.mutation<Route, Partial<Route>>({
            query: ({ id, ...patch }) => ({
                url: `routes/${id}/`,
                method: 'PUT',
                body: patch,
            }),
        }),
        deleteRoute: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `routes/${id}/`,
                method: 'DELETE',
            }),
        }),
        getFuelStations: builder.query<FuelStation[], void>({
            query: () => 'fuelstations/',
        }),
        getRouteStations: builder.query<RouteStation[], { routeId: number }>({
            query: ({ routeId }) => `routes/${routeId}/stations/`,
        }),
        completeRouteStation: builder.mutation<RouteStation, { id: number }>({
            query: ({ id }) => ({
                url: `routestations/${id}/complete/`,
                method: 'POST',
            }),
        }),
        getDriverRoutes: builder.query<Route[], { driverId: string }>({
            query: ({ driverId }) => `routestations/driver_routes/?driver_id=${driverId}`,
        }),
    }),
});

export const {
    useGetTrucksQuery,
    useAddTruckMutation,
    useUpdateTruckMutation,
    useDeleteTruckMutation,
    useGetFuelTypesQuery,
    useGetRoutesQuery,
    useAddRouteMutation,
    useUpdateRouteMutation,
    useDeleteRouteMutation,
    useGetFuelStationsQuery,
    useGetRouteStationsQuery,
    useCompleteRouteStationMutation,
    useGetDriverRoutesQuery,
} = refineryApi;
