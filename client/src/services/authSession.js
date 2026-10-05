import { refreshAccessToken } from "./authService";
import { useAuthStore } from "../store/authStore";

let restorePromise = null;

export async function restoreSession() {
    if (restorePromise) {
        return restorePromise;
    }

    restorePromise = (async () => {

        try {
            const data = await refreshAccessToken();

            useAuthStore
                .getState()
                .setAuth(data.user, data.accessToken);


            return true;
        } catch (error) {


            useAuthStore
                .getState()
                .clearAuth();

            return false;
        }
    })();

    return restorePromise;
}