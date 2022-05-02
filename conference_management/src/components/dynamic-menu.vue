<template>
  <div class="menu-container">
    <template v-for="v in menuList">
      <!-- 一级菜单 -->
      <el-submenu
        :index="v.name"
        v-if="v.children && v.children.length > 0"
        :key="v.name"
      >
        <template slot="title">
          <i class="iconfont" :class="v.meta.icon"></i>
          <span>{{ v.meta.name }}</span>
        </template>
        <!-- 调用自己走下面的else获得二级菜单 -->
        <el-menu-item-group>
          <my-nav :menuList="v.children" :firstmenu="v.meta.name"></my-nav>
        </el-menu-item-group>
      </el-submenu>
      <!-- 二级菜单 -->
      <el-menu-item
        :key="v.name"
        :index="v.name"
        @click="gotoRoute(firstmenu,v.meta.name,v.name)"
        v-else
      >
        <i class="iconfont" :class="v.meta.icon"></i>
        <span slot="title">{{ v.meta.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "my-nav",
  props: {
    menuList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    firstmenu:{
      type:String,
      default:''
    }
  },
  methods: {
    gotoRoute(firstmenu,secondmenu,name) {
      console.log(firstmenu)
      const selectedMenu = [firstmenu, secondmenu]
      this.$router.push({ name }).catch(()=>{}); 
      this.$store.commit("permission/SET_CURRENTMENU",name)
      this.$store.commit("permission/SET_SELECTEDMENUNAME",selectedMenu)
    },
  },
};
</script>

<style scoped>
.iconfont{
  font-size: 18px;
  color: white;
  margin-right: 10px;
}
</style>