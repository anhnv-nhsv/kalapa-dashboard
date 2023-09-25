<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title"></div>
      <div class="card-toolbar">
        <button
          class="btn btn-flex btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#kt_user_action_modal"
          @click.prevent="changeAction('create')"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          Add user
        </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <NHDatatable
        :table-header="tableHeader"
        :table-data="userList"
        :loading="loading"
        :show-overflow-tooltip="true"
      >
        <template v-slot:indexColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            type="index"
            label="STT"
            width="50"
          />
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            label="Thao tác"
            width="200"
          >
            <template #default="scope">
              <div class="d-flex">
                <el-button
                  size="small"
                  type="default"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_user_action_modal"
                  @click.prevent="changeAction('update-role', scope.row)"
                >
                  Change role
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click.prevent="deleteUser(scope.row)"
                >
                  Delete
                </el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </NHDatatable>
    </div>
  </div>
  <UserAction :action="userAction" :data="rowData" @on-success="getUserList" />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useUserMgmt } from "@/stores/user-mgmt";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import UserAction from "@/components/users/modal/UserAction.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ThemeModeComponent } from "@/assets/ts/layout";
import { useThemeStore } from "@/stores/theme";

export default defineComponent({
  name: "user-management",
  components: {
    UserAction,
    NHDatatable,
  },
  setup() {
    const store = useUserMgmt();
    const themeStore = useThemeStore();
    const loading = ref<boolean>(false);
    const userAction = ref<string>("");
    const tableHeader = ref([
      {
        label: "Username",
        prop: "username",
        visible: true,
      },
      {
        label: "Vai trò",
        prop: "role",
        visible: true,
      },
      {
        label: "Giới hạn request Kalapa",
        prop: "limit_req_to_kalapa",
        visible: true,
      },
    ]);
    let userList = ref();
    const rowData = ref();

    const getUserList = async () => {
      console.log("call getUserList");
      loading.value = true;
      await store.getUserList(null);
      const userListResp = JSON.parse(JSON.stringify(store.userList));
      userList.value = userListResp.data;
      loading.value = false;
    };

    const callDeleteUserAPI = (username, userDelete) => {
      console.log(`call callDeleteUserAPI`);
      loading.value = true;
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("user_delete", userDelete);
      loading.value = false;
      return store.deleteUser(params);
      // return store.userDeletion;
    };

    const changeAction = (action, row?) => {
      userAction.value = action;
      if (row) {
        rowData.value = row;
      }
    };

    const themeMode = computed(() => {
      if (themeStore.mode === "system") {
        return ThemeModeComponent.getSystemMode();
      }
      return themeStore.mode;
    });

    const deleteUser = (row) => {
      if (window.localStorage.getItem("username")) {
        Swal.fire({
          titleText: "Are you sure to delete this user?",
          icon: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonText: "Yes, delete this user",
          customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-secondary",
          },
          preConfirm: () => {
            return callDeleteUserAPI(
              window.localStorage.getItem("username"),
              row.username
            )
              .then(({ data }) => {
                if (!data.success) {
                  throw new Error(data.mess);
                }
                return data;
              })
              .catch((error) => {
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          },
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
          if (result.value) {
            await getUserList();
            const swal2TimerProgressBar = document.getElementsByClassName(
              "swal2-timer-progress-bar-container"
            );
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: "success",
              title: "Deleted successfully",
            });
          }
        });
      } else {
        Swal.fire({
          text: "Something failed. Please sign-in again or contact administrator!",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    };

    onBeforeMount(() => {
      getUserList();
    });

    return {
      tableHeader,
      loading,
      userAction,
      userList,
      rowData,
      getUserList,
      changeAction,
      deleteUser,
    };
  },
});
</script>

<style scoped lang="scss"></style>
