<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title flex-column">
        <div class="row">
          <div class="d-flex">
            <div class="w-auto me-10">
              <div class="form-check form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="searchType"
                  :checked="searchType == 'searchType1'"
                  v-bind:value="'searchType1'"
                  name="searchType"
                  id="searchType1"
                />
                <label class="form-check-label" for="searchType1">
                  Single customer
                </label>
              </div>
            </div>
            <div class="w-auto me-10">
              <div class="form-check form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="searchType"
                  :checked="searchType == 'searchType2'"
                  v-bind:value="'searchType2'"
                  name="searchType"
                  id="searchType2"
                />
                <label class="form-check-label" for="searchType2">
                  All customers
                </label>
              </div>
            </div>
            <div class="w-auto me-10">
              <div class="form-check form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="searchType"
                  :checked="searchType == 'searchType3'"
                  v-bind:value="'searchType3'"
                  name="searchType"
                  id="searchType3"
                />
                <label class="form-check-label" for="searchType3">
                  Import customers
                </label>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 25px">
          <div
            v-if="searchType == 'searchType1'"
            class="d-flex row"
            id="single-customer"
          >
            <form
              class="form row"
              autoComplete="on"
              @submit.prevent="searchCustomerScore"
            >
              <div
                class="
                  col-md-3
                  d-flex
                  align-items-center
                  position-relative
                  my-1
                "
              >
                <!--                <input-->
                <!--                  v-model="formSearch1.idNo"-->
                <!--                  autoFocus-->
                <!--                  type="text"-->
                <!--                  class="form-control form-control-solid w-180px"-->
                <!--                  placeholder="Identity number"-->
                <!--                />-->
                <el-input
                  autofocus
                  v-model="formSearch1.idNo"
                  placeholder="Identity number"
                />
              </div>
              <div
                class="
                  col-md-3
                  d-flex
                  align-items-center
                  position-relative
                  my-1
                "
              >
                <!--                <input-->
                <!--                  v-model="formSearch1.fullName"-->
                <!--                  type="text"-->
                <!--                  class="form-control form-control-solid w-180px"-->
                <!--                  placeholder="Full name"-->
                <!--                />-->
                <el-input
                  v-model="formSearch1.fullName"
                  placeholder="Full name"
                />
              </div>
              <div
                class="
                  col-md-3
                  d-flex
                  align-items-center
                  position-relative
                  my-1
                "
              >
                <!--                <input-->
                <!--                  v-model="formSearch1.phoneNum"-->
                <!--                  type="text"-->
                <!--                  class="form-control form-control-solid w-180px"-->
                <!--                  placeholder="Phone number"-->
                <!--                />-->
                <el-input
                  v-model="formSearch1.phoneNum"
                  placeholder="Phone number"
                />
              </div>
              <div
                class="
                  col-md-3
                  d-flex
                  align-items-center
                  position-relative
                  my-1
                "
              >
                <button
                  :data-kt-indicator="loading ? 'on' : null"
                  type="submit"
                  class="btn btn-primary"
                >
                  <span v-if="!loading" class="indicator-label">Search</span>
                  <span v-if="loading" class="indicator-progress"
                    >Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span
                  ></span>
                </button>
              </div>
            </form>
          </div>
          <div
            v-if="searchType == 'searchType2'"
            class="d-flex row"
            id="all-customers"
          >
            <div
              class="w-auto d-flex align-items-center position-relative my-1"
            >
              <button
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_sync_kalapa_data"
              >
                <span class="indicator-label">Sync from Kalapa</span>
              </button>
            </div>
            <div
              class="w-auto d-flex align-items-center position-relative my-1"
            >
              <button
                class="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#kt_customer_export_modal"
              >
                <span class="indicator-label">Export report</span>
              </button>
            </div>
          </div>
          <div
            v-if="searchType == 'searchType3'"
            class="d-flex row"
            id="import-customers"
          >
            <div
              class="w-auto d-flex align-items-center position-relative my-1"
            >
              <button class="btn btn-secondary">
                <span class="indicator-label">Import from excel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--end::Card title-->
    </div>
    <div class="card-body pt-0">
      <CustomerDatatable
        v-if="customerScoreData && pagination"
        :table-header="tableHeader"
        :table-header-flattened="tableHeaderFlattened"
        :table-data="customerScoreData"
        :pagination="pagination"
        @change-page="changePage"
      >
        <template v-slot:cell-seq="{ row: reqs }">{{ reqs.seq }}</template>
        <template v-slot:cell-idno="{ row: reqs }">{{ reqs.idno }}</template>
        <template v-slot:cell-tel="{ row: reqs }">{{ reqs.tel }}</template>
        <template v-slot:cell-custNM="{ row: reqs }">{{
          reqs.custNM
        }}</template>
        <template v-slot:cell-score="{ row: reqs }">
          <span v-if="reqs.userScore.score >= 801 && reqs.userScore.score <= 850" class="badge badge-lg badge-success">{{ reqs.userScore.score }}</span>
          <span v-if="reqs.userScore.score >= 600 && reqs.userScore.score <= 800" class="badge badge-lg badge-primary">{{ reqs.userScore.score }}</span>
          <span v-if="reqs.userScore.score >= 500 && reqs.userScore.score <= 599" class="badge badge-lg badge-warning">{{ reqs.userScore.score }}</span>
          <span v-if="reqs.userScore.score >= 350 && reqs.userScore.score <= 499" class="badge badge-lg badge-danger">{{ reqs.userScore.score }}</span>
        </template>
        <template v-slot:cell-cnte="{ row: reqs }">
          {{ reqs.cnte }}
        </template>
        <template v-slot:cell-nameSimilarScore="{ row: reqs }">{{
          reqs.userScore.nameSimilarScore
        }}</template>
        <template v-slot:cell-phoneMatched="{ row: reqs }">{{
          reqs.userScore.phoneMatched
        }}</template>
        <template v-slot:cell-fi="{ row: reqs }">
          <span class="badge badge-lg" :class="{ 'badge-success': reqs.blacklist.fi === '0', 'badge-danger': reqs.blacklist.fi === '1'}">
            {{ reqs.blacklist.fi }}
          </span>
        </template>
        <template v-slot:cell-pdl="{ row: reqs }">
          <span class="badge badge-lg" :class="{ 'badge-success': reqs.blacklist.pdl === '0', 'badge-danger': reqs.blacklist.pdl === '1'}">
            {{ reqs.blacklist.pdl }}
          </span>
        </template>
        <template v-slot:cell-creditScore1="{ row: reqs }">{{
          reqs.creditScore.creditScore1
        }}</template>
        <template v-slot:cell-creditScore2="{ row: reqs }">{{
          reqs.creditScore.creditScore2
        }}</template>
        <template v-slot:cell-creditScore3="{ row: reqs }">{{
          reqs.creditScore.creditScore3
        }}</template>
        <template v-slot:cell-job1Score="{ row: reqs }">{{
          reqs.jobScore.job1Score
        }}</template>
        <template v-slot:cell-job1Nm="{ row: reqs }">{{
          reqs.jobScore.job1Nm
        }}</template>
        <template v-slot:cell-job1TaxCd="{ row: reqs }">{{
          reqs.jobScore.job1TaxCd
        }}</template>
        <template v-slot:cell-job1StrtDt="{ row: reqs }">{{
          reqs.jobScore.job1StrtDt
        }}</template>
        <template v-slot:cell-job1EndDt="{ row: reqs }">{{
          reqs.jobScore.job1EndDt
        }}</template>
        <template v-slot:cell-job2Score="{ row: reqs }">{{
          reqs.jobScore.job2Score
        }}</template>
        <template v-slot:cell-job2Nm="{ row: reqs }">{{
          reqs.jobScore.job2Nm
        }}</template>
        <template v-slot:cell-job2TaxCd="{ row: reqs }">{{
          reqs.jobScore.job2TaxCd
        }}</template>
        <template v-slot:cell-job2StrtDt="{ row: reqs }">{{
          reqs.jobScore.job2StrtDt
        }}</template>
        <template v-slot:cell-job2EndDt="{ row: reqs }">{{
          reqs.jobScore.job2EndDt
        }}</template>
        <template v-slot:cell-job3Score="{ row: reqs }">{{
          reqs.jobScore.job3Score
        }}</template>
        <template v-slot:cell-job3Nm="{ row: reqs }">{{
          reqs.jobScore.job3Nm
        }}</template>
        <template v-slot:cell-job3TaxCd="{ row: reqs }">{{
          reqs.jobScore.job3TaxCd
        }}</template>
        <template v-slot:cell-job3StrtDt="{ row: reqs }">{{
          reqs.jobScore.job3StrtDt
        }}</template>
        <template v-slot:cell-job3EndDt="{ row: reqs }">{{
          reqs.jobScore.job3EndDt
        }}</template>
        <template v-slot:cell-acntNo="{ row: reqs }">{{
          reqs.acntNo
        }}</template>
      </CustomerDatatable>
    </div>
  </div>

  <SyncKalapaModal />
  <ExportCustomerModal />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref, toRaw } from "vue";
import { MenuComponent } from "@/assets/ts/components";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import store from "@/store";
import { Actions } from "@/store/enums/StoreEnums";
import CustomerDatatable from "@/components/customers/table/CustomerDatatable.vue";
import SyncKalapaModal from "@/components/customers/modal/SyncKalapaModal.vue";
import ExportCustomerModal from "@/components/customers/modal/ExportCustomerModal.vue";

export default defineComponent({
  name: "customer-score-list",
  components: {
    ExportCustomerModal,
    SyncKalapaModal,
    CustomerDatatable,
  },
  setup() {
    const searchType = ref("searchType1");
    const formSearch1 = ref({
      idNo: "",
      phoneNum: "",
      fullName: "",
    });
    const tableHeader = ref([
      [
        { name: "STT", rowspan: 2, key: "seq" },
        { name: "Số ID của KH", rowspan: 2, key: "idno" },
        { name: "Số điện thoại của KH", rowspan: 2, key: "tel" },
        { name: "Tên khách hàng", rowspan: 2, key: "custNM" },
        { name: "USER SCORE", colspan: 4 },
        { name: "BLACK_LIST", colspan: 2 },
        { name: "CREDIT_SCORE", colspan: 3 },
        { name: "JOB SCORE", colspan: 15 },
        { name: "Số Tài khoản GDCK", rowspan: 2, key: "acntNo" },
      ],
      [
        { name: "Score", key: "score" },
        { name: "Mô tả kết quả", key: "cnte" },
        { name: "Name similar score", key: "nameSimilarScore" },
        { name: "Phone similar score", key: "phoneMatched" },
        { name: "FI", key: "fi" },
        { name: "PDL", key: "pdl" },
        { name: "E-wallet, Buy now pay later", key: "creditScore1" },
        { name: "Bank & FI", key: "creditScore2" },
        { name: "Microlending (Short-term loan app)", key: "creditScore3" },
        { name: "Score 1", key: "job1Score" },
        { name: "Tên Công ty của KH 1", key: "job1Nm" },
        { name: "Mã số thuế của Công ty 1", key: "job1TaxCd" },
        { name: "Start date 1", key: "job1StrtDt" },
        { name: "End date 1", key: "job1EndDt" },
        { name: "Score 2", key: "job2Score" },
        { name: "Tên Công ty của KH 2", key: "job2Nm" },
        { name: "Mã số thuế của Công ty 2", key: "job2TaxCd" },
        { name: "Start date 2", key: "job2StrtDt" },
        { name: "End date 2", key: "job2EndDt" },
        { name: "Score 3", key: "job3Score" },
        { name: "Tên Công ty của KH 3", key: "job3Nm" },
        { name: "Mã số thuế của Công ty 3", key: "job3TaxCd" },
        { name: "Start date 3", key: "job3StrtDt" },
        { name: "End date 3", key: "job3EndDt" },
      ],
    ]);
    let tableHeaderFlattened = ref();
    const loading = ref(false);
    let customerScoreData = ref();
    let pagination = ref();

    function moveElement(array, fromIndex, toIndex) {
      const arrayCopy = [...array];
      const element = arrayCopy.splice(fromIndex, 1)[0];
      arrayCopy.splice(toIndex, 0, element);
      return arrayCopy;
    }

    async function getCustomersScore(
      page?: number,
      idNo?: string,
      phone?: string,
      fullName?: string,
      pageSize = 10
    ) {
      console.log(`call API`);
      loading.value = true;
      await store.dispatch(Actions.GET_CUSTOMERS_SCORE_ACTION, {
        params: {
          idNo: idNo ? idNo : "",
          phone: phone ? phone : "",
          name: fullName ? fullName : "",
          page: page,
          pageSize: pageSize,
        },
      });
      const customersScoreResp = store.getters.getCustomersScore;
      customerScoreData.value = customersScoreResp.data;
      pagination.value = {
        totalPages: customersScoreResp.totalPages,
        pageNo: customersScoreResp.pageNo,
        pageSize: customersScoreResp.pageSize,
        totalCount: customersScoreResp.totalCount,
        currentCount: customersScoreResp.currentCount,
      };
      loading.value = false;
    }

    function searchCustomerScore() {
      console.log("searchCustomerScore");
      const formDataRaw = JSON.parse(JSON.stringify(formSearch1.value));
      getCustomersScore(
        1,
        formDataRaw.idNo,
        formDataRaw.phoneNum,
        formDataRaw.fullName
      );
    }

    function changePage(page) {
      console.log("changePage");
      getCustomersScore(page);
    }
    onBeforeMount(() => {
      getCustomersScore(1);
    });
    onMounted(() => {
      MenuComponent.reinitialization();
      const rawTableHeaderFlattened: any[] = []
        .concat(...JSON.parse(JSON.stringify(tableHeader.value)))
        .filter((e) => Object.prototype.hasOwnProperty.call(e, "key"));
      tableHeaderFlattened.value = moveElement(
        rawTableHeaderFlattened,
        4,
        rawTableHeaderFlattened.length - 1
      );
      setCurrentPageBreadcrumbs("Customers Score", ["Apps", "Customers"]);
    });
    const truncatedText = (txt, length) => {
      if (txt) {
        if (txt.length <= length) {
          return txt;
        } else {
          return txt.substring(0, length) + '...';
        }
      } else {
        return '';
      }
    }
    return {
      searchType,
      tableHeader,
      tableHeaderFlattened,
      customerScoreData,
      changePage,
      loading,
      pagination,
      searchCustomerScore,
      formSearch1,
      truncatedText,
    };
  },
});
</script>

<style scoped></style>
