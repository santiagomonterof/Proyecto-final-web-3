import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/authSliceApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/authSlice";
import { pumpApi } from "./features/pumpSlice";
import { salesApi } from "./features/saleSlice";
import { refineryApi } from "./features/refinerySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [pumpApi.reducerPath]: pumpApi.reducer,
        [salesApi.reducerPath]: salesApi.reducer,
        [refineryApi.reducerPath]: refineryApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, pumpApi.middleware, salesApi.middleware, refineryApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
