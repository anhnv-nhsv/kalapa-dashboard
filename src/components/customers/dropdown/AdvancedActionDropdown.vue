<template>
  <div class="menu menu-sub menu-sub-dropdown w-550px" data-kt-menu="true">
    <div class="px-7 py-5">
      <div class="fs-5 text-dark fw-bolder">Advanced action</div>
    </div>
    <div class="separator border-gray-200"></div>
    <div class="px-7 py-5">
      <div class="d-flex justify-content-start">
        <button
            type="button"
            class="btn btn-light-primary me-5"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_sync_kalapa_data"
        >
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/files/fil019.svg" />
          </span>
          Sync Kalapa
        </button>
        <button
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
            type="button"
            class="btn btn-light-primary"
            disabled
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
  <ExportCustomerModal />
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import ExportCustomerModal from "@/components/customers/modal/ExportCustomerModal.vue";
import SyncKalapaModal from "@/components/customers/modal/SyncKalapaModal.vue";

interface Filter {
  status: string;
  author: boolean;
  customer: boolean;
  notifications: boolean;
}

export default defineComponent({
  name: "advanced-action-dropdown",
  components: {
    ExportCustomerModal,
    // SyncKalapaModal,
  },
  setup(props, ctx) {
    const columns = ref([
      {
        name: 'User Score',
        key: 'user-score',
      }, {
        name: 'Blacklist',
        key: 'blacklist',
      }, {
        name: 'Credit Score',
        key: 'credit-score',
      }, {
        name: 'Job Score',
        key: 'job-score',
      }
    ]);
    const formSearch = ref({
      idNo: "",
      phoneNum: "",
      fullName: "",
      acctNo: "",
      userScore: "",
      blacklist: "",
    });

    const searchCustomerHandler = () => {
      ctx.emit("search", formSearch.value);
      formSearch.value = {
        idNo: "",
        phoneNum: "",
        fullName: "",
        acctNo: "",
        userScore: "",
        blacklist: "",
      };
    }

    return {
      columns,
      formSearch,
      searchCustomerHandler,
    };
  },
});
</script>
