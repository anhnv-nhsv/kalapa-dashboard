<template>
  <div
    class="modal fade"
    id="kt_modal_sync_kalapa_data"
    ref="syncKalapaModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_sync_kalapa_data_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">Sync data from Kalapa</h2>
          <!--end::Modal title-->
          <!--begin::Close-->
          <div
            id="kt_modal_sync_kalapa_data_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
          <!--end::Close-->
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <template v-if="syncType === 'selection'">
            Do you want to synchronize selected data from Kalapa?
          </template>
          <template v-else>
            Do you want to synchronize all data from Kalapa?
          </template>
          <el-form
            ref="formRef"
            :model="syncForm"
            @submit.prevent="syncKalapa(formRef)"
          >
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              Check all
            </el-checkbox>
            <el-form-item
              prop="checkedTypes"
              :rules="[
                {
                  required: true,
                  message: 'Please select at least one sync type',
                },
              ]"
            >
              <el-checkbox-group
                v-model="syncForm.checkedTypes"
                @change="handleCheckedTypesChange"
              >
                <el-checkbox
                  v-for="type in syncTypes"
                  :key="type.typeId"
                  :label="type.typeId"
                  :disabled="type.disabled"
                >
                  {{ type.typeName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="text-center">
              <button
                type="reset"
                id="kt_customer_export_cancel"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
                @click.prevent="resetForm(formRef)"
              >
                Discard
              </button>
              <button
                :data-kt-indicator="loading ? 'on' : null"
                type="submit"
                class="btn btn-lg btn-primary"
              >
                <span v-if="!loading" class="indicator-label">
                  Submit
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
              <!--end::Button-->
            </div>
            <!--end::Actions-->
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onUpdated, reactive, ref, watch} from "vue";
import { hideModal } from "@/core/helpers/dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useCustomerStore } from "@/stores/customer-score";
import type { FormInstance } from "element-plus";

export default defineComponent({
  name: "sync-kalapa-modal",
  props: {
    syncPayload: { type: Array, required: false, default: () => [] },
    syncType: { type: String, required: false, default: () => "" },
  },
  setup(props) {
    const store = useCustomerStore();
    const loading = ref(false);
    const syncKalapaModalRef = ref<null | HTMLElement>(null);
    const syncPropData = ref(props.syncPayload);
    const temSyncData = ref(JSON.parse(JSON.stringify(syncPropData.value)));
    const formRef = ref<FormInstance>();
    const syncTypes = [
      {
        typeId: 1,
        typeName: "User score",
        disabled: true,
      },
      {
        typeId: 2,
        typeName: "Blacklist score",
        disabled: false,
      },
      {
        typeId: 3,
        typeName: "Job score",
        disabled: true,
      },
      {
        typeId: 4,
        typeName: "Credit score",
        disabled: true,
      },
    ];
    const checkAll = ref(false);
    const isIndeterminate = ref(false);
    const syncForm = reactive<any>({
      checkedTypes: [],
    });
    watch(
      () => props.syncPayload,
      (newVal) => {
        syncPropData.value = newVal;
        temSyncData.value = syncPropData.value;
      }
    );

    watch(
      () => props.syncType,
      (newVal) => {
        if (newVal === "all") {
          syncPropData.value = [];
        } else {
          syncPropData.value = temSyncData.value;
        }
      }
    );

    async function callAPISyncKalapaData() {
      console.log(`call API sync Kalapa`);
      loading.value = true;
      const rawPropData = JSON.parse(JSON.stringify(syncPropData.value));
      const syncPayload = rawPropData.map((e) => {
        return {
          id: e.idno,
          name: e.custNM,
          mobile: e.tel,
        };
      });
      await store.syncKalapaScore(syncPayload, {
        params: {
          searchType: syncForm.checkedTypes.join(","),
          processedBy: localStorage.getItem("username"),
        },
      });
      const syncStatusCode = store.syncKalapaStatusCode;
      loading.value = false;
      return syncStatusCode;
    }

    function syncKalapa(formEl: FormInstance | undefined) {
      loading.value = true;
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          if (window.localStorage.getItem("limit_req_to_kalapa")) {
            if (
              syncPropData.value.length >
                Number(window.localStorage.getItem("limit_req_to_kalapa")) ||
              props.syncType == "all"
            ) {
              loading.value = false;
              Swal.fire({
                text: "Maximum number of customers reached. Please try again later.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
            } else {
              setTimeout(async () => {
                const syncStatusCode = await callAPISyncKalapaData();
                loading.value = false;
                if (syncStatusCode == 204) {
                  Swal.fire({
                    text: "Request has been received. Wait a minute while synchronizing then reload page!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                      confirmButton: "btn btn-primary",
                    },
                  }).then(() => {
                    hideModal(syncKalapaModalRef.value);
                  });
                } else {
                  Swal.fire({
                    text: "Request has been failed. Please contact administrator!",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                      confirmButton: "btn btn-primary",
                    },
                  }).then(() => {
                    hideModal(syncKalapaModalRef.value);
                  });
                }
              }, 1000);
            }
          } else {
            loading.value = false;
            Swal.fire({
              text: "Maximum number of customers reached. Please try again later.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            }).then(() => {
              hideModal(syncKalapaModalRef.value);
            });
          }
        } else {
          loading.value = false;
          return false;
        }
      });
    }

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      checkAll.value = false;
      isIndeterminate.value = false;
      formEl.resetFields();
    };

    const handleCheckAllChange = (val: boolean) => {
      syncForm.checkedTypes = val
        ? syncTypes.filter((e) => !e.disabled).map((e) => e.typeId)
        : [];
      isIndeterminate.value = false;
    };
    const handleCheckedTypesChange = (value: any[]) => {
      const checkedCount = value.length;
      checkAll.value = checkedCount === syncTypes.length;
      isIndeterminate.value =
        checkedCount > 0 && checkedCount < syncTypes.length;
    };

    return {
      loading,
      syncKalapaModalRef,
      syncTypes,
      checkAll,
      isIndeterminate,
      formRef,
      syncForm,
      resetForm,
      syncKalapa,
      handleCheckAllChange,
      handleCheckedTypesChange,
    };
  },
});
</script>

<style scoped></style>
