import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isInitializing: true,

    setAuth: (user, accessToken) =>
        set({
            user,
            accessToken,
            isAuthenticated: true,
            isInitializing: false,
        }),

    setAccessToken: (accessToken) =>
        set({
            accessToken,
            isAuthenticated: true,
        }),

    clearAuth: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isInitializing: false,
        }),
}));