<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <!--        <div class="d-flex align-items-center position-relative my-1">-->
        <!--          <span class="svg-icon svg-icon-1 position-absolute ms-6">-->
        <!--            <inline-svg src="media/icons/duotune/general/gen021.svg"/>-->
        <!--          </span>-->
        <!--          <input-->
        <!--              type="text"-->
        <!--              class="form-control form-control-solid w-250px ps-15"-->
        <!--              placeholder="Search Customers"-->
        <!--          />-->
        <!--        </div>-->
        <!--end::Search-->
        <form class="form row" autoComplete="on" @submit.prevent="submitSearch">
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <span class="svg-icon svg-icon-1 position-absolute ms-6">
              <inline-svg src="media/icons/duotune/general/gen021.svg"/>
            </span>
            <input
              autoFocus
              type="text"
              class="form-control form-control-solid w-180px ps-15"
              placeholder="Username"
              v-model="formSearchData.username"
            />
          </div>
          <div
            class="col-md-6 d-flex align-items-center position-relative my-1"
          >
            <!--                  <span class="svg-icon svg-icon-1 position-absolute ms-6">-->
            <!--                    <inline-svg src="media/icons/duotune/general/gen014.svg" />-->
            <!--                  </span>-->
            <!--              <input type="text" class="form-control form-control-solid w-180px ps-15"-->
            <!--                     placeholder="To date" />-->
            <el-date-picker
              class="form-control form-control-solid w-180px ps-15"
              type="daterange"
              range-separator="-"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="DD/MM/YYYY"
              value-format="DD/MM/YYYY"
              v-model="formSearchData.dateRange"
            />
          </div>
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <button :data-kt-indicator="loading ? 'on' : null" type="submit" class="btn btn-primary">
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
      <!--end::Card title-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        :table-data="dataRequestStatistics"
        :table-header="tableHeader"
        :pagination="pagination"
        @change-page="changePage"
      >
        <template v-slot:cell-seq="{ row: reqs }">
          {{ reqs.seq }}
        </template>
        <template v-slot:cell-clientUserName="{ row: reqs }">
          {{ reqs.clientUserName }}
        </template>
        <template v-slot:cell-fromIP="{ row: reqs }">
          {{ reqs.fromIP }}
        </template>
        <template v-slot:cell-apiUri="{ row: reqs }">
          {{ reqs.apiUri }}
        </template>
        <template v-slot:cell-statusCode="{ row: reqs }">
          {{ reqs.statusCode }}
        </template>
        <template v-slot:cell-message="{ row: reqs }">
          {{ reqs.message }}
        </template>
        <template v-slot:cell-thirtyServiceAPIURI="{ row: reqs }">
          {{ reqs.thirtyServiceAPIURI }}
        </template>
        <template v-slot:cell-thirtyResponseTime="{ row: reqs }">
          {{ reqs.thirtyResponseTime }}
        </template>
      </Datatable>
<!--      <div v-else class="dataTables_wrapper dt-bootstrap4 no-footer">-->
<!--        <div class="table-responsive">-->
<!--          <table-->
<!--            class="-->
<!--          table-->
<!--          align-middle-->
<!--          table-row-dashed-->
<!--          fs-6-->
<!--          gy-5-->
<!--          dataTable-->
<!--          no-footer-->
<!--        "-->
<!--            id="kt_customers_table"-->
<!--            role="grid"-->
<!--          >-->
<!--            no data-->
<!--          </table>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, ref} from "vue";
import Datatable from "@/components/kt-datatable/Datatable.vue";
import store from "@/store";
import {Actions} from "@/store/enums/StoreEnums";
import moment from "moment/moment";
import {setCurrentPageBreadcrumbs} from "@/core/helpers/breadcrumb";
import {MenuComponent} from "@/assets/ts/components";

export default defineComponent({
  name: "request-statistics",
  components: {
    Datatable,
  },
  setup() {
    const formSearchData = ref({
      username: '',
      dateRange: [
        moment().startOf("month").format('DD/MM/YYYY'),
        moment().format('DD/MM/YYYY')
      ],
    });
    const tableHeader = ref([
      {
        name: "STT",
        key: "seq",
      },
      {
        name: "Tên",
        key: "clientUserName",
      },
      {
        name: "IP",
        key: "fromIP",
      },
      {
        name: "API URI",
        key: "apiUri",
      },
      {
        name: "Status code",
        key: "statusCode",
      },
      {
        name: "Message",
        key: "message",
      },
      {
        name: "3rd API URI",
        key: "thirtyServiceAPIURI",
      },
      {
        name: "Thời gian phản hồi 3rd",
        key: "thirtyResponseTime",
      },
    ]);
    const loading = ref<boolean>(false);
    let dataRequestStatistics = ref();
    let pagination = ref();

    async function getRequestStatistics(page?: number, username?: string, fromDate?: string, toDate?: string, pageSize = 10) {
      console.log("call API")
      loading.value = true;
      await store.dispatch(Actions.GET_REQUEST_STATISTICS_ACTION, {
        params: {
          username: username ? username : '',
          fromDate: fromDate ? fromDate : moment().startOf('month').format('DD/MM/YYYY'),
          toDate: toDate ? toDate : moment().format('DD/MM/YYYY'),
          page: page,
          pageSize: pageSize,
        },
      });
      const requestStatisticsResponse = store.getters.requestStatisticsResponse;
      dataRequestStatistics.value = requestStatisticsResponse.data;
      pagination.value = {
        totalPages: requestStatisticsResponse.totalPages,
        pageNo: requestStatisticsResponse.pageNo,
        pageSize: requestStatisticsResponse.pageSize,
        totalCount: requestStatisticsResponse.totalCount,
        currentCount: requestStatisticsResponse.currentCount,
      };
      loading.value = false;
    }

    // getRequestStatistics();
    // const dataRequestStatistics = computed(() => {
    //   return store.getters.requestStatisticsResponse.data;
    // });
    // const pagination = computed(() => {
    //   return {
    //     totalPages: store.getters.requestStatisticsResponse.totalPages,
    //     pageNo: store.getters.requestStatisticsResponse.pageNo,
    //     pageSize: store.getters.requestStatisticsResponse.pageSize,
    //     totalCount: store.getters.requestStatisticsResponse.totalCount,
    //     currentCount: store.getters.requestStatisticsResponse.currentCount,
    //   };
    // });

    function submitSearch() {
      // getRequestStatistics();
      // let formData = toRaw(formSearchData.value);
      // console.log('submitSearch')
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestStatistics(1, formData.username, formData.dateRange[0], formData.dateRange[1]);
    };

    function changePage(page) {
      // let formData = toRaw(formSearchData.value);
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      // console.log(`changePage ${page}`)
      // console.log(formData)
      getRequestStatistics(page, formData.username, formData.dateRange[0], formData.dateRange[1]);
    }

    onBeforeMount(() => {
      // console.log('onBeforeMount')
      getRequestStatistics(1);
    });
    onMounted(() => {
      // console.log('onMounted')
      MenuComponent.reinitialization();
      setCurrentPageBreadcrumbs("Request Statistics", ["Apps", "Statistics"]);
    });
    return {
      dataRequestStatistics,
      tableHeader,
      changePage,
      pagination,
      loading,
      submitSearch,
      formSearchData,
    };
  },
});
</script>

<style scoped></style>
