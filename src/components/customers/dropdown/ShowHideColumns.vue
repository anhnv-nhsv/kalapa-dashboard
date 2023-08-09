<template>
  <!--begin::Menu 1-->
  <div
      class="menu menu-sub menu-sub-dropdown w-250px"
      data-kt-menu="true"
  >

    <!--begin::Form-->
    <div class="px-7 py-5">
      <div class="mb-10">
        <el-table show-header="false" :data="columns">
          <el-table-column type="selection" width="55"/>
          <el-table-column label="Columns name" prop="name" />
        </el-table>
      </div>
    </div>
    <!--end::Form-->
  </div>
  <!--end::Menu 1-->
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

interface Filter {
  status: string;
  author: boolean;
  customer: boolean;
  notifications: boolean;
}

export default defineComponent({
  name: "show-hide-columns",
  components: {},
  setup() {
    const columns = ref([{
      name: 'User Score',
      key: 'user-score',
    },{
      name: 'Blacklist',
      key: 'blacklist',
    },{
      name: 'Credit Score',
      key: 'credit-score',
    },{
      name: 'Job Score',
      key: 'job-score',
    }]);

    return {
      columns,
    };
  },
});
</script>
