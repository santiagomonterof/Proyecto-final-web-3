import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/authSliceApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { clientApi } from "./features/clientSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [clientApi.reducerPath]: clientApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, clientApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
