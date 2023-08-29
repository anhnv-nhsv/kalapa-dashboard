<template>
  <div
    class="modal fade"
    id="kt_customer_import_modal"
    ref="importCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-700px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">Import Customers</h2>
          <div
            id="kt_customer_import_close"
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
            :model="syncForm"
            @submit.prevent="syncKalapa(formRef)"
          >
            <div class="row fv-row mb-5">
              <input
                type="file"
                class="form-control"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                @change="changeFile($event)"
              />
            </div>
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
import { defineComponent, reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useCustomerStore } from "@/stores/customer-score";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "import-customer-modal",
  setup() {
    const store = useCustomerStore();
    const loading = ref(false);
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
    const dataFromFile = ref<any[]>([]);

    async function callAPISyncKalapaData(payload) {
      console.log(`call API sync Kalapa`);
      loading.value = true;
      await store.syncKalapaScore(payload, {
        params: {
          searchType: syncForm.checkedTypes.join(","),
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
              dataFromFile.value.length >
              Number(window.localStorage.getItem("limit_req_to_kalapa"))
            ) {
              loading.value = false;
              dataFromFile.value = [];
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
                const payload = dataFromFile.value.map((e) => {
                  const obj = JSON.parse(JSON.stringify(e));
                  return {
                    id: obj["Column 1"],
                    name: obj["Column 3"],
                    mobile: obj["Column 2"],
                  };
                });
                const syncStatusCode = await callAPISyncKalapaData(payload);
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
                  });
                } else {
                  dataFromFile.value = [];
                  Swal.fire({
                    text: "Request has been failed. Please contact administrator!",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                      confirmButton: "btn btn-primary",
                    },
                  });
                }
              }, 1000);
            }
          } else {
            loading.value = false;
            dataFromFile.value = [];
            Swal.fire({
              text: "Maximum number of customers reached. Please try again later.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          }
        } else {
          loading.value = false;
          return false;
        }
      });
    }

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

    const changeFile = async (e) => {
      const file = e.target.files[0];
      const reader: FileReader = new FileReader();

      try {
        reader.readAsArrayBuffer(file);
      } catch (err) {
        dataFromFile.value = [];
      }
      reader.onload = (e: any) => {
        // upload file
        const binarystr = new Uint8Array(e.target.result);
        const wb: XLSX.WorkBook = XLSX.read(binarystr, {
          type: "array",
          raw: true,
          cellFormula: false,
        });
        const wsname = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
        dataFromFile.value = data;
      };
    };

    return {
      loading,
      formRef,
      syncTypes,
      checkAll,
      isIndeterminate,
      syncForm,
      changeFile,
      syncKalapa,
      handleCheckAllChange,
      handleCheckedTypesChange,
    };
  },
});
</script>

<style scoped lang="scss">
//:deep(.el-upload-dragger) {
//  display: flex;
//  flex-direction: column;
//  align-content: center;
//  align-items: center;
//  justify-content: center;
//}
.el-icon--upload-error {
  color: var(--el-color-error);
}
</style>
