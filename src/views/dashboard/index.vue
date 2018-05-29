<template>
  <div class="dashboard-container" style="margin:30px;">
    <h1 class='dashboard-text'>欢迎登录:{{name}}</h1>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <div slot="header">
            <span>个人信息</span>
            <el-button style="float: right;" type="text" @click="$router.push('/page/修改个人信息/user/selfService')">编辑个人信息
            </el-button>
          </div>
          <json-view :json-object="info" :label-map="userInfoLabelMap"></json-view>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            您的角色信息
          </div>
          <json-view :json-object="roleInfo" :label-map="roleInfoLabelMap"></json-view>
        </el-card>
      </el-col>
    </el-row>

    <!--<el-tabs type="border-card">-->
    <!--<el-tab-pane label="个人信息">-->
    <!--{{info}}-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane label="权限信息">-->

    <!--</el-tab-pane>-->
    <!--</el-tabs>-->
  </div>
</template>

<script>
  import {getName} from '../../utils/auth'
  import userInfo from '../../api/sys_user'
  import roleAPI from '../../api/sys_role'
  import JsonView from "../../components/jsonView";

  export default {
    name: 'dashboard',
    components: {JsonView},
    computed: {
      name() {
        return getName()
      }
    },
    data() {
      this._api = userInfo.new()
      this.roleApi = roleAPI.new()
      return {
        info: {},
        roleInfo: {},
        userInfoLabelMap: {
          id: '个人ID',
          ip: 'IP地址',
          sys_role__id: '角色',
          work_id:'工号',
          last_login:'最后登录时间',
          expire: '登录失效时间',
          phone:'个人手机',

        },
        roleInfoLabelMap: {
          id: '角色ID',
          name: '角色名',
          level: '等级',
          children: '关联角色',
          dic: '访问权限',
        }
      }
    },
    created() {
      this.refreshUserInfo()
    },

    methods: {
      refreshUserInfo() {
        this._api.getUserInfo().then(data => {
          this.info = data.data
          let role = this.info.role || this.info.sys_role__id
          this.roleInfo = this.info.role_info
          // let role = this.roleApi.getById(this.info.role)
          // if (role) {
          //   this.info.role = role.name
          // }
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
