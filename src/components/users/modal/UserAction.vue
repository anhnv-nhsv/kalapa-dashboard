<template>
  <div
    class="modal fade"
    id="kt_user_action_modal"
    ref="createUserModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-500px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 v-if="action === 'create'" class="fw-bolder">Create user</h2>
          <h2 v-if="action === 'update-role'" class="fw-bolder">
            Update role {{ createUserForm.username }}
          </h2>
          <div
            id="kt_user_action_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <el-form
            ref="formRef"
            :label-position="'right'"
            label-width="100px"
            :model="createUserForm"
            :rules="creationRules"
          >
            <el-form-item
              v-if="action === 'create'"
              label="Username"
              prop="username"
              class="w-100"
            >
              <el-input
                v-model="createUserForm.username"
                autocomplete="off"
                placeholder="Username"
              />
            </el-form-item>
            <el-form-item
              v-if="action === 'create'"
              label="Password"
              prop="password"
              class="w-100"
            >
              <el-input
                v-model="createUserForm.password"
                type="password"
                autocomplete="off"
                placeholder="Password"
              />
            </el-form-item>
            <el-form-item label="Role" prop="role" class="w-100">
              <el-select
                v-model="createUserForm.role"
                placeholder="Select role"
              >
                <el-option label="Admin" value="admin" />
                <el-option label="KSNB & QTRR" value="ksnb" />
                <el-option label="CLKD" value="clkd" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer flex-center">
          <button
            type="reset"
            id="kt_user_action_modal_cancel"
            class="btn btn-light me-3"
            @click.prevent="resetForm(formRef)"
          >
            Reset
          </button>
          <button
            :data-kt-indicator="loading ? 'on' : null"
            type="submit"
            class="btn btn-lg btn-primary"
            @click.prevent="handleRequest(formRef)"
          >
            <span v-if="!loading" class="indicator-label">
              <span v-if="action === 'create'">Create</span>
              <span v-if="action === 'update-role'">Update role</span>
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="loading" class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useUserMgmt } from "@/stores/user-mgmt";
import type { FormInstance } from "element-plus";
import { hideModal } from "@/core/helpers/dom";

export default defineComponent({
  name: "user-action",
  props: {
    action: { type: String, required: true, default: () => "" },
    data: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const store = useUserMgmt();
    const loading = ref(false);
    const formRef = ref<FormInstance>();
    const createUserForm = ref({
      username: "",
      password: "",
      role: "",
    });
    const creationRules = ref({
      username: [
        { required: true, message: "Please input username", trigger: "blur" },
        {
          min: 3,
          message: "Username must be at least 3 characters long",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "Please input password", trigger: "blur" },
        {
          min: 6,
          message: "Password must be at least 6 characters long",
          trigger: "blur",
        },
      ],
      role: [
        {
          required: true,
          message: "Please select role",
          trigger: "blur",
        },
      ],
    });
    const createUserModalRef = ref<null | HTMLElement>(null);

    watch(
      () => props.data,
      (newVal) => {
        createUserForm.value.username = newVal.username;
        createUserForm.value.role = newVal.role;
      }
    );

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const callCreateUserAPI = async () => {
      console.log(`call API`);
      loading.value = true;
      const params = new URLSearchParams();
      params.append("username", createUserForm.value.username);
      params.append("password", createUserForm.value.password);
      params.append("role", createUserForm.value.role);
      await store.createUser(params);
      loading.value = false;
      return store.userCreations;
    };

    const callupdateRoleAPI = async () => {
      console.log(`call API`);
      loading.value = true;
      const params = new URLSearchParams();
      params.append("username", createUserForm.value.username);
      params.append("role", createUserForm.value.role);
      await store.updateRole(params);
      loading.value = false;
      return store.userModification;
    };

    const handleRequest = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          let resp;
          if (props.action === "create") {
            resp = await callCreateUserAPI();
          } else if (props.action === "update-role") {
            resp = await callupdateRoleAPI();
          }
          if (resp) {
            if (resp["data"].success) {
              Swal.fire({
                text: resp["data"].mess,
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              }).then(() => {
                ctx.emit("on-success");
                createUserForm.value = { username: "", password: "", role: "" };
                hideModal(createUserModalRef.value);
              });
            } else {
              Swal.fire({
                text: resp["data"].mess,
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
            }
          } else {
            console.log("error submit!", fields);
          }
        }
      });
    };

    return {
      loading,
      createUserForm,
      creationRules,
      formRef,
      createUserModalRef,
      resetForm,
      handleRequest,
    };
  },
});
</script>

<style scoped></style>
