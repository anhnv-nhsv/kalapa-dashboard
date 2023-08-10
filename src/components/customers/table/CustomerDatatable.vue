<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <div class="table-responsive">
      <!--      <table-->
      <!--        class="-->
      <!--          table table-striped table-bordered-->
      <!--          border-->
      <!--          align-middle-->
      <!--          fs-6-->
      <!--          gy-5-->
      <!--          dataTable-->
      <!--          no-footer-->
      <!--        "-->
      <!--        id="kt_customers_table"-->
      <!--        role="grid"-->
      <!--      >-->
      <!--        &lt;!&ndash;begin::Table head&ndash;&gt;-->
      <!--        <thead style="background-color: #ffc342">-->
      <!--          <template v-for="(row, i) in tableHeader" :key="i">-->
      <!--            &lt;!&ndash;begin::Table row&ndash;&gt;-->
      <!--            <tr-->
      <!--              class="-->
      <!--                text-center text-gray-800-->
      <!--                fw-bolder-->
      <!--                fs-7-->
      <!--                text-uppercase-->
      <!--                gs-0-->
      <!--              "-->
      <!--              role="row"-->
      <!--            >-->
      <!--              <template v-for="(cell, i) in row" :key="i">-->
      <!--                <th-->
      <!--                  :class="[cell.name && 'min-w-125px', 'text-middle']"-->
      <!--                  :rowspan="cell.rowspan"-->
      <!--                  :colspan="cell.colspan"-->
      <!--                >-->
      <!--                  {{ cell.name }}-->
      <!--                </th>-->
      <!--              </template>-->
      <!--            </tr>-->
      <!--            &lt;!&ndash;end::Table row&ndash;&gt;-->
      <!--          </template>-->
      <!--        </thead>-->
      <!--        &lt;!&ndash;end::Table head&ndash;&gt;-->
      <!--        &lt;!&ndash;begin::Table body&ndash;&gt;-->
      <!--        <tbody class="">-->
      <!--          <template v-if="!isEmptyTableData">-->
      <!--            <template v-for="(item, i) in getItems" :key="i">-->
      <!--              <tr>-->
      <!--                <template v-for="(cell, i) in tableHeaderFlattened" :key="i">-->
      <!--                  <td class="text-center">-->
      <!--                    <slot :name="`cell-${cell.key}`" :row="item">-->
      <!--                      {{ item[prop] }}-->
      <!--                    </slot>-->
      <!--                  </td>-->
      <!--                </template>-->
      <!--                &lt;!&ndash;end::Item=&ndash;&gt;-->
      <!--              </tr>-->
      <!--            </template>-->
      <!--          </template>-->
      <!--          <template v-else>-->
      <!--            <tr class="odd">-->
      <!--              <td colspan="8" class="dataTables_empty">No data found</td>-->
      <!--            </tr>-->
      <!--          </template>-->
      <!--        </tbody>-->
      <!--        &lt;!&ndash;end::Table body&ndash;&gt;-->
      <!--      </table>-->
      <el-table
        class="customerTable"
        ref="customerScoreTableRef"
        :data="getItems"
        :header-cell-style="{'background-color': '#ffc342'}"
        header-row-class-name="text-gray-800 fw-bolder fs-7 text-uppercase gs-0"
        :highlight-current-row="userRole === 'single'"
        max-height="600"
        v-on="userRole === 'all' ? { 'selection-change': handleSelectionChange } : { 'current-change': handleCurrentChange }"
        v-loading="loading"
      >
        <el-table-column header-align="center" class-name="text-center" v-if="userRole === 'all'" type="selection" width="55"/>
        <template
            v-for="(item, i) in tableHeader"
            :key="i">
          <el-table-column
              header-align="center" class-name="text-center"
              v-if="item.visible"
              v-bind="item.hasOwnProperty('width') ? { 'width' : item.width} : { 'min-width' : 125}"
              :label="item.label">
            <template #default="scope" v-if="item.hasOwnProperty('prop')">{{ scope.row[item.prop] }}</template>
            <template v-if="item.hasOwnProperty('children')">
              <el-table-column
                  header-align="center"
                  class-name="text-center"
                  v-for="(child, j) in item.children"
                  :key="`${i}${j}`"
                  v-bind="child.hasOwnProperty('width') ? { 'width' : child.width} : { 'min-width' : 125}"
                  :label="child.label"
                  :prop="child.prop"/>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <div class="row">
      <div
          class="
          col-sm-12 col-md-5
          d-flex
          align-items-center
          justify-content-center justify-content-md-start
        "
      >
        <div v-if="enableItemsPerPageDropdown" class="dataTables_length" id="kt_customers_table_length">
          <div class="row ">
            <el-select style="width: 100px" v-model="paginationObj.pageSize" size="small" @change="setCurrentPageSize">
              <el-option v-for="item in pageSizeList" :key="item" :label="item" :value="item"/>
            </el-select>
          </div>
          <!--          <label-->
          <!--          ><select-->
          <!--              name="kt_customers_table_length"-->
          <!--              class="form-select form-select-sm form-select-solid"-->
          <!--              v-model="paginationObj.pageSize"-->
          <!--          >-->
          <!--            <option value="10">10</option>-->
          <!--            <option value="25">25</option>-->
          <!--            <option value="50">50</option>-->
          <!--            <option value="100">100</option>-->
          <!--          </select></label-->
          <!--          >-->
        </div>
      </div>
      <div class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
        <el-pagination
            v-if="!isEmptyTableData"
            background
            layout="prev, pager, next"
            @current-change="setCurrent"
            :current-page="paginationObj.pageNo"
            :hide-on-single-page="false"
            :page-count="pages"
            :page-size="parseInt(paginationObj.pageSize)"
            :total="paginationObj.totalPages"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
  watch,
  toRaw,
  onUpdated,
} from "vue";

export default defineComponent({
  name: "customer-datatable",
  props: {
    tableHeader: {type: Array, required: true, default: () => []},
    tableHeaderFlattened: {type: Array, required: false, default: () => []},
    tableData: {type: Array, required: true, default: () => []},
    pagination: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    enableItemsPerPageDropdown: {type: Boolean, required: false, default: false},
    loading: {type: Boolean, required: false, default: false},
    userRole: {type: String, required: true, default: 'none'}
  },
  components: {},
  setup(props, ctx) {
    let data = ref(props.tableData);
    let getItems = ref(JSON.parse(JSON.stringify(data.value)));
    const paginationData = ref(props.pagination);
    let paginationObj = ref(JSON.parse(JSON.stringify(paginationData.value)));
    let isEmptyTableData = ref(getItems.value.length === 0);
    let multipleSelection = ref<any[]>([]);
    let currentRow = ref();
    const pageSizeList = ref([10, 20, 50, 100, 200, 500, 1000]);

    watch(
        () => props.tableData,
        (newVal, oldVal) => {
          getItems.value = newVal;
          isEmptyTableData.value = getItems.value.length === 0;
        }
    );

    watch(
        () => props.pagination,
        (newVal, oldVal) => {
          paginationObj.value = newVal;
        }
    );
    onMounted(() => {
      // paginationObj.value.pageSize = props.pageSize ? props.pageSize : 10;
      // paginationObj.value.total = data.value['totalCount'];
    });

    const pages = computed(() => {
      // return Math.ceil(pagination.value.total / pagination.value.pageSize);
      return toRaw(paginationObj.value).totalPages;
    });
    const setCurrent = (val) => {
      paginationObj.value.pageNo = val;
      ctx.emit("change-page", val);
    };

    const setCurrentPageSize = (val) => {
      paginationObj.value.pageSize = val;
      ctx.emit("change-page-size", val);
    };

    const handleSelectionChange = (val: any[]) => {
      multipleSelection.value = val;
      ctx.emit("multiple-select", val);
    };

    const handleCurrentChange = (val: any | undefined) => {
      currentRow.value = val
      ctx.emit("single-select", val);
    };

    return {
      paginationObj,
      pages,
      setCurrent,
      setCurrentPageSize,
      getItems,
      isEmptyTableData,
      handleSelectionChange,
      handleCurrentChange,
      multipleSelection,
      pageSizeList,
    };
  },
});
</script>

<style scoped lang="scss">

.customerTable {
  clear: both;
  margin-top: 6px !important;
  margin-bottom: 6px !important;
  max-width: none !important;
  border-collapse: separate !important;
  border-spacing: 0;
}

:deep(.cell) {
  word-break: break-word;
}

//table.dataTable {
//  clear: both;
//  margin-top: 6px !important;
//  margin-bottom: 6px !important;
//  max-width: none !important;
//  border-collapse: separate !important;
//  border-spacing: 0;
//}
//
//table.dataTable > thead {
//  th.sorting {
//    position: relative;
//  }
//
//  .sorting:after {
//    position: absolute;
//  }
//}

:deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .el-pager li) {
  background: none;
  border-radius: 0.475rem;
  font-weight: 500;
  font-size: 1.075rem;
  font-family: Poppins, Helvetica, sans-serif;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #009ef7;
}

/*Scroll bar nav*/
:deep(::-webkit-scrollbar) {
  height: 10px;
  width: 10px;
}

/* Track */
//:deep(::-webkit-scrollbar-track) {
//  background: #000 !important;
//}

/* Handle */
:deep(::-webkit-scrollbar-thumb) {
  background: #cccccc;
}

/* Handle on hover */
:deep(::-webkit-scrollbar-thumb:hover) {
  background: #aaaaaa;
}

/* Handle on active, holding */
:deep(::-webkit-scrollbar-thumb:active) {
  background: #888888;
}
</style>
