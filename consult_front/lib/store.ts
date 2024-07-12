import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/authSliceApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/authSlice";
import { pumpApi } from "./features/pumpSlice";
import { salesApi } from "./features/saleSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [pumpApi.reducerPath]: pumpApi.reducer,
        [salesApi.reducerPath]: salesApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, pumpApi.middleware, salesApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
