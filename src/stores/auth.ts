import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  success: boolean;
  token: string;
  limit_req_to_kalapa: string;
  username: string;
  role: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());
  const permissionsList = ref([]);

  function setPermissionsList(data) {
    permissionsList.value = data;
    window.localStorage.setItem(
      "grantedPermissions",
      JSON.stringify(
        data.data.filter((x: any) => x.role === localStorage.getItem("role"))[0]
      )
    );
  }

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.token);
    window.localStorage.setItem(
      "limit_req_to_kalapa",
      user.value.limit_req_to_kalapa
    );
    window.localStorage.setItem("username", user.value.username);
    window.localStorage.setItem("role", user.value.role);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
    window.localStorage.removeItem("limit_req_to_kalapa");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("grantedPermissions");
  }

  function login(credentials: User) {
    return ApiService.post("/auth", credentials)
      .then(async ({ data }) => {
        setAuth(data);
        if (JwtService.getToken()) {
          ApiService.setHeader();
          await getPermissionsList();
        }
      })
      .catch((response) => {
        setError(response.data.errors);
      });
  }

  function getPermissionsList(params?: any) {
    return ApiService.query("/users/get-all-permission", params)
      .then(({ data }) => {
        setPermissionsList(data);
      })
      .catch((response) => {
        console.error(response);
        // setError(response.data.errors);
      });
  }

  function logout() {
    purgeAuth();
  }

  // function register(credentials: User) {
  //   return ApiService.post("register", credentials)
  //     .then(({ data }) => {
  //       setAuth(data);
  //     })
  //     .catch(({ response }) => {
  //       setError(response.data.errors);
  //     });
  // }

  // function forgotPassword(email: string) {
  //   return ApiService.post("forgot_password", email)
  //     .then(() => {
  //       setError({});
  //     })
  //     .catch(({ response }) => {
  //       setError(response.data.errors);
  //     });
  // }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      // ApiService.post("verify_token", { api_token: JwtService.getToken() })
      //   .then(({ data }) => {
      //     setAuth(data);
      //   })
      //   .catch(({ response }) => {
      //     setError(response.data.errors);
      //     purgeAuth();
      //   });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    // register,
    // forgotPassword,
    verifyAuth,
  };
});
