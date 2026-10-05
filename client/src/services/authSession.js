import { useAuthStore } from "../store/authStore";
import { refreshAccessToken } from "./authService";

export async function restoreSession() {
    try {
        const data = await refreshAccessToken();

        useAuthStore.getState().setAuth(data.user, data.acccessToken);

        return true;
    } catch () {
        useAuthStore
            .getState()
            .clearAuth();

        return false
    }
}