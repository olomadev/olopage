import jwt from "jsonwebtoken";
// import config from "../config";

export function isAuthenticated(token) {
    // We check if app runs with backend mode
    // if (!config.isBackend && token) return true;
    if (!token) return;
    const date = new Date().getTime() / 1000;
    const data = jwt.decode(token);
    if (!data) return;
    if (date < data.exp) {
        return data
    } else {
        return false
    }
}

export const AuthMixin = {
    methods: {
        isAuthenticated
    }
};
