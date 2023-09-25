import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useUserMgmt = defineStore("user-mgmt", () => {
  const userList = ref([]);
  const userCreations = ref({});
  const userModification = ref({});
  const userDeletion = ref({});
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setUserList(data) {
    userList.value = data;
  }

  function setUserCreations(data) {
    userCreations.value = data;
  }

  function setUserModification(data) {
    userModification.value = data;
  }

  function setUserDeletion(data) {
    userDeletion.value = data;
  }

  function getUserList(params) {
    return ApiService.post("/users/getAllUsers", params)
      .then(({ data }) => {
        setUserList(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function createUser(params) {
    return ApiService.post("/users/create-user", params)
      .then((res) => {
        setUserCreations(res);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function deleteUser(params) {
    return ApiService.post("/users/deleteUser", params);
  }

  function updateRole(params) {
    return ApiService.post("/users/updateUserRole", params)
      .then((res) => {
        setUserModification(res);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  return {
    userList,
    userCreations,
    userModification,
    userDeletion,
    errors,
    getUserList,
    createUser,
    deleteUser,
    updateRole,
  };
});
