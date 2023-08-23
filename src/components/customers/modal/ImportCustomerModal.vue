<template>
  <div
    class="modal fade"
    id="kt_customer_import_modal"
    ref="importCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-500px">
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
          <el-form ref="formRef">
            <div class="row fv-row mb-5">
              <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="/api/account-info/import"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                drag
                :limit="1"
                :headers="{ 'Content-Type': 'multipart/form-data;' }"
                :on-exceed="handleExceed"
                :http-request="handleRequest"
              >
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip text-red">
                    Limit 1 file, new file will cover the old file.<br/>Please check carefully before import.
                  </div>
                </template>
                <template v-slot:file="file">
                  <ul class="el-upload-list el-upload-list--text mb-5">
                    <li
                      class="el-upload-list__item is-success"
                      tabindex="0"
                      style=""
                    >
                      <!--v-if-->
                      <div class="el-upload-list__item-info">
                        <a class="el-upload-list__item-name">
                          <el-icon><Document /></el-icon>
                          <span
                            class="el-upload-list__item-file-name"
                            :title="file.file.name"
                            >{{ file.file.name }}</span
                          ></a
                        >
                        <!--v-if-->
                      </div>
                      <label class="el-upload-list__item-status-label">
                        <el-icon
                          :class="{
                            'el-icon--upload-success': importStatus,
                            'el-icon--upload-error': !importStatus,
                          }"
                        >
                          <CircleCheck v-if="importStatus" />
                          <CircleClose v-if="!importStatus" />
                        </el-icon>
                      </label>
                      <i class="el-icon el-icon--close" @click="removeFile">
                        <el-icon><Close /></el-icon>
                      </i>
                      <!-- Due to close btn only appears when li gets focused disappears after li gets blurred, thus keyboard navigation can never reach close btn-->
                      <!-- This is a bug which needs to be fixed -->
                      <!-- TODO: Fix the incorrect navigation interaction -->
                      <!--                      <i class="el-icon--close-tip">press delete to remove</i>-->
                      <!--v-if-->
                    </li>
                  </ul>
                  <el-alert
                    :title="importStatus ? 'Request has been received. Wait a minute while synchronizing then reload page!' : 'Import failed'"
                    :type="importStatus ? 'success' : 'error'"
                    show-icon
                  />
                </template>
              </el-upload>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { genFileId } from "element-plus";
import type { UploadProps, UploadInstance, UploadRawFile } from "element-plus";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import { useCustomerStore } from "@/stores/customer-score";
import { Document } from "@element-plus/icons-vue";

export default defineComponent({
  name: "import-customer-modal",
  components: { Document },
  setup() {
    const loading = ref(false);
    const importStatus = ref(false);
    const fileList = ref();
    const uploadRef = ref<UploadInstance>();
    const store = useCustomerStore();

    const handleExceed: UploadProps["onExceed"] = (files) => {
      uploadRef.value!.clearFiles();
      const file = files[0] as UploadRawFile;
      file.uid = genFileId();
      uploadRef.value!.handleStart(file);
      uploadRef.value!.submit();
    };

    const removeFile = () => {
      uploadRef.value!.clearFiles();
    };

    const handleError = async (err) => {
      importStatus.value = false;
      await closeAlert(2000);
    };

    const handleSuccess = async (res) => {
      importStatus.value = true;
      await closeAlert(3000);
    };

    const handleRequest = async (options) => {
      const formData = new FormData();
      formData.append("file", options.file);
      await store
        .importExcel(options.action, formData, options.headers)
        .then((res) => (options.onSuccess = handleSuccess(res)))
        .catch((err) => (options.onError = handleError(err)));
    };

    const closeAlert = (ms) => {
      setTimeout(() => {
        document.querySelector('#kt_customer_import_modal .el-icon.el-alert__close-btn').click();
      }, ms);
    };

    return {
      loading,
      fileList,
      uploadRef,
      importStatus,
      handleExceed,
      handleError,
      handleSuccess,
      handleRequest,
      removeFile,
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
