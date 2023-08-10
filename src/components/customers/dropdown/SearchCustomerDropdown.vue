<template>
  <!--begin::Menu 1-->
  <div class="menu menu-sub menu-sub-dropdown w-550px" data-kt-menu="true">
    <div class="px-7 py-5">
      <div class="fs-5 text-dark fw-bolder">Search customers</div>
    </div>
    <div class="separator border-gray-200"></div>
    <!--begin::Form-->
    <div class="px-7 py-5">
      <el-form :inline="true" :model="formSearch">
        <el-form-item>
          <el-input v-model="formSearch.idNo" placeholder="Identity number"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formSearch.phoneNum" placeholder="Phone"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formSearch.fullName" placeholder="Customer name"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formSearch.acctNo" placeholder="Account number"/>
        </el-form-item>
        <el-form-item>
          <el-date-picker
              type="daterange"
              range-separator="-"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="DD/MM/YYYY"
              value-format="YYYYMMDD"
              v-model="formSearch.dateRange"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="formSearch.userScore" placeholder="User score" clearable>
            <el-option label="801 - 850" value="801-850"/>
            <el-option label="600 - 800" value="600-800"/>
            <el-option label="500 - 599" value="500-599"/>
            <el-option label="450 - 499" value="450-499"/>
            <el-option label="350 - 400" value="350-400"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formSearch.blacklist" placeholder="Blacklist" clearable>
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
          </el-select>
        </el-form-item>
      </el-form>

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button
            type="reset"
            class="btn btn-sm btn-white btn-active-light-primary me-2"
            data-kt-menu-dismiss="true"
        >
          Close
        </button>

        <button
          type="submit"
          class="btn btn-sm btn-primary"
          @click.prevent="searchCustomerHandler"
          data-kt-menu-dismiss="true"
        >
          Apply
        </button>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import moment from "moment";

interface Filter {
  status: string;
  author: boolean;
  customer: boolean;
  notifications: boolean;
}

export default defineComponent({
  name: "search-customer-dropdown",
  components: {},
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
      dateRange: [],
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
        dateRange: [],
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
