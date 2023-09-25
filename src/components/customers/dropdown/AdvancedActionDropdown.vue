<template>
  <div class="menu menu-sub menu-sub-dropdown w-auto" data-kt-menu="true">
    <div class="px-7 py-5">
      <div class="fs-5 text-dark fw-bolder">Advanced action</div>
    </div>
    <div class="separator border-gray-200"></div>
    <div class="px-7 py-5">
      <div class="d-flex justify-content-start">
        <button
          v-if="role.grantedPermissions.customer['sync_selected'] === '1'"
          type="button"
          class="btn btn-light-primary me-5"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_sync_kalapa_data"
          disabled
        >
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/files/fil019.svg" />
          </span>
          Sync Kalapa
        </button>
        <button
          v-if="role.grantedPermissions.customer['export_file'] === '1'"
          type="button"
          class="btn btn-light-primary me-5"
          data-bs-toggle="modal"
          data-bs-target="#kt_customer_export_modal"
        >
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/files/fil010.svg" />
          </span>
          Export report
        </button>
        <button
          v-if="role.grantedPermissions.customer['import_file'] === '1'"
          type="button"
          class="btn btn-light-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_customer_import_modal"
        >
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/files/fil009.svg" />
          </span>
          Import
        </button>
      </div>
    </div>
  </div>

  <!--  <SyncKalapaModal :sync-payload="[]"/>-->
  <ExportCustomerModal :search-payload="searchPayload" />
  <ImportCustomerModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ExportCustomerModal from "@/components/customers/modal/ExportCustomerModal.vue";
import ImportCustomerModal from "@/components/customers/modal/ImportCustomerModal.vue";

export default defineComponent({
  name: "advanced-action-dropdown",
  components: {
    ImportCustomerModal,
    ExportCustomerModal,
  },
  props: {
    searchPayload: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const role = JSON.parse(localStorage.getItem("grantedPermissions") || "{}");
    return {
      role,
    };
  },
});
</script>
