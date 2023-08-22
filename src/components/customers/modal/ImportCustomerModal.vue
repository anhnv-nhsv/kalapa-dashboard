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
            <div class="row fv-row mb-15">
              <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="http://localhost:8081/api/account-info/import"
                v-model:file-list="fileList"
                :limit="1"
                :on-exceed="handleExceed"
                :auto-upload="false"
              >
                <template #trigger>
                  <el-button type="primary">Select file</el-button>
                </template>
                <el-button class="ml-3" type="success" @click="submitUpload">
                  upload to server
                </el-button>
                <template #tip>
                  <div class="el-upload__tip text-red">
                    limit 1 file, new file will cover the old file
                  </div>
                </template>
              </el-upload>
            </div>
            <div class="text-center">
              <button
                type="reset"
                id="kt_customer_import_cancel"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
                @click="submitUpload"
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

export default defineComponent({
  name: "import-customer-modal",
  setup() {
    const loading = ref(false);
    const fileList = ref();
    const uploadRef = ref<UploadInstance>();

    const handleExceed: UploadProps["onExceed"] = (files) => {
      uploadRef.value!.clearFiles();
      const file = files[0] as UploadRawFile;
      file.uid = genFileId();
      uploadRef.value!.handleStart(file);
    };

    const submitUpload = () => {
      uploadRef.value!.submit();
    };

    return {
      loading,
      fileList,
      uploadRef,
      handleExceed,
      submitUpload,
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
</style>
