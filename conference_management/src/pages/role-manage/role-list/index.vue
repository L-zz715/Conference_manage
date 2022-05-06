<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <!-- 用户列表区 -->
    <el-table
      :data="roleObjList"
      style="width: 100%"
      border
      stripe
      @expand-change="getRights"
    >
      <!-- 下面这一个column添加的是展开链 可以用来展开二F级菜单-->
      <el-table-column type="expand" width="50px">
        <template slot-scope="scope">
            <!-- {{scope.row}} -->
          <el-row
            :class="index1 === 0 ? 'bdtop' : ''"
            class="bdbottom"
            v-for="(cObj1, index1) in roleRightsList"
            :key="cObj1._id"
          >
            <!-- 渲染一级权限 col一共有24列 -->
            <el-col :span="5">
              <el-tag size="mini">
                {{ cObj1.name }}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>

            <!-- 渲染二级权限 -->
            <el-col :span="19">
              <el-row
                :class="index2 === 0 ? '' : 'bdtop'"
                v-for="(cObj2, index2) in cObj1.children"
                :key="cObj2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    size="mini"
                  >
                    {{ cObj2.name }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 下面这一个column添加的是索引链 -->
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="rolename" label="角色名称"> </el-table-column>
      <el-table-column prop="description" label="角色描述"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Pagination from "@/components/Pagination.vue";
import { mapState } from "vuex";
import { getRoleRights } from "@/api";
export default {
  name: "Roles-list",
  components: { Breadcrumb, Pagination },
  data() {
    return {
      roleRightsList: [],
    };
  },
  computed: {
    ...mapState("permission", ["roleObjList"]),
  },
  mounted() {},
  methods: {
    async getRights(row) {
      let res = await getRoleRights(row.rolename);
      this.roleRightsList = res.data;
    },
  },
};
</script>

<style scoped>
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.el-row {
  margin: 2% 6%;
  display: flex;
  align-items: center;
}
</style>