
import cookies from "olobase-admin/src/utils/cookies";
import FetchHydra from "../utils/fetchHydra";
const cookieKey = JSON.parse(import.meta.env.VITE_COOKIE);

export default (httpClient, params = {}) => {
  if (typeof httpClient === "string") {
    httpClient = new FetchHydra(httpClient);
  }
  params = {
    routes: {
      login: "auth/token",
      logout: "auth/logout",
      refresh: "auth/refresh",
      user: "auth/me",
    },
    getToken: (r) => r.token,
    getCredentials: ({ username, password }) => {
      return {
        username,
        password,
      };
    },
    getId: (r) => r.user.id,
    getFullname: (r) => r.user.fullname,
    getEmail: (r) => r.user.email,
    getAvatar: () => localStorage.getItem("avatar"),
    getPermissions: (r) => r.user.permissions,
    ...params,
  };

  let {
    routes,
    getCredentials,
    getId,
    getFullname,
    getEmail,
    getAvatar,
    getPermissions,
    getToken,
  } = params;

  return {
    async login({ username, password }) { 
      const response = await httpClient.post(
        routes.login,
        getCredentials({ username, password })
      );
      cookies.remove(cookieKey.token);
      cookies.remove(cookieKey.user);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }
      cookies.set(cookieKey.user, JSON.stringify(response.data.data.user));
      cookies.set(cookieKey.token, getToken(response.data.data));
      localStorage.setItem("avatar", response.data.data.avatar);
      return Promise.resolve(response);
    },
    async logout() {
      let response = null;
      if (routes.logout) {
        try {
          response = await httpClient.get(routes.logout)
        }
        catch(err) {
          console.error(err)
        }
      }
      cookies.remove(cookieKey.user)
      cookies.remove(cookieKey.token)
      return Promise.resolve(response);
    },
    async checkAuth() {
      const token = cookies.get(cookieKey.token)
      if (typeof token == "undefined" || token == "undefined" || token == "") {
          return Promise.reject()
      }
      let user = JSON.parse(cookies.get(cookieKey.user))
      if (user) {
        return Promise.resolve({
          data: {
              avatar: localStorage.getItem("avatar"),
              token: token,
              user: user,
              cookieKey: {
                user:  cookieKey.user,
                token: cookieKey.token,
              }
          },
        })
      } else {
          return Promise.reject()
      }
    },
    checkError({ status }) {
      if (status === 401 || status === 403) {
        cookies.remove(cookieKey.user)
        cookies.remove(cookieKey.token);
        return Promise.reject();
      }
      return Promise.resolve();
    },
    getId(response) { 
      return getId(response);
    },
    getFullname(response) {
      return getFullname(response)
    },
    getEmail(response) {
      return getEmail(response);
    },
    getAvatar() { 
      return getAvatar();
    },
    getPermissions(response) {
      return getPermissions(response);
    },

  };
};
