import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useCustomerStore = defineStore("customer-score", () => {
  const customersScoreResp = ref([]);
  const syncKalapaStatusCode = ref(-1);
  const importedFileStatusCode = ref(-1);
  const exportedCustomerResp = ref({});
  const validSyncResp = ref(false);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setCustomersScore(data) {
    customersScoreResp.value = data;
  }

  function setSyncKalapaStatus(status) {
    syncKalapaStatusCode.value = status;
  }

  function setExportedResult(data) {
    exportedCustomerResp.value = data;
  }

  function setImportedFileStatusCode(status) {
    importedFileStatusCode.value = status;
  }

  function setValidSync(res) {
    validSyncResp.value = res.data.data.isLessThan30days;
  }

  function getCustomersScore(params) {
    return ApiService.query("/api/account-info", params)
      .then(({ data }) => {
        setCustomersScore(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function syncKalapaScore(params, config) {
    return ApiService.post("/api/account-info/sync-kalapa", params, config)
      .then(({ status }) => {
        setSyncKalapaStatus(status);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function exportCustomersScore(params) {
    return ApiService.query("/api/account-info/export/excel", params)
      .then((response) => {
        setExportedResult(response);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function validateSync(params) {
    return ApiService.post("/api/account-info/validate-sync", params)
      .then((response) => {
        setValidSync(response);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function importExcel(path, params, config) {
    return ApiService.post(path, params, config);
  }

  return {
    customersScoreResp,
    syncKalapaStatusCode,
    exportedCustomerResp,
    validSyncResp,
    errors,
    getCustomersScore,
    syncKalapaScore,
    exportCustomersScore,
    importExcel,
    validateSync,
  };
});
