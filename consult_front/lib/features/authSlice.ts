import { AuthState, User } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            sessionStorage.setItem('auth', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            sessionStorage.removeItem('auth');
        },
        loadUserFromStorage: (state) => {
            const storedUser = sessionStorage.getItem('auth');
            if (storedUser) {
                state.user = JSON.parse(storedUser);
            }
        },
    },
});

export const { setUser, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
