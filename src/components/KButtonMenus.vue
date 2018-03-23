<template>
  <div class="KButtonMenuWrap" style="display: inline-block;" v-if="hasButton||hasMenu">
    <template v-if="hasButton">
      <el-button-group v-if="group">
        <template v-for="(item, i) in getButtonEvents()">
          <el-tooltip :content="item.label" placement="top" :enterable="false" :open-delay="200" :disabled="label">
            <el-button :size="size" :round="round" :type="item.type" :icon="item.icon"
                       @click="doEvent(item.name)" v-if="label">{{item.label}}</el-button>
            <el-button :size="size" :round="round" :type="item.type" :icon="item.icon"
                       @click="doEvent(item.name)" v-else></el-button>
          </el-tooltip>
        </template>
      </el-button-group>
      <template v-else>
        <template v-for="(item, i) in getButtonEvents()">
          <el-tooltip :content="item.label" placement="top" :enterable="false" :open-delay="200" :disabled="label">
            <el-button :size="size" :round="round" :type="item.type" :icon="item.icon"
                       @click="doEvent(item.name)" v-if="label">{{item.label}}</el-button>
            <el-button :size="size" :round="round" :type="item.type" :icon="item.icon"
                       @click="doEvent(item.name)" v-else v-text="">{{item.label}}</el-button>
          </el-tooltip>
        </template>
      </template>
    </template>
    <el-dropdown @command="doEvent" v-if="hasMenu">
      <el-button type="primary" :size="size" :round="round" v-if="menuText">{{menuText}}<i
        class="el-icon-arrow-down el-icon--right"></i></el-button>
      <el-button type="primary" :size="size" icon="el-icon-arrow-down" :round="round" v-else></el-button>
      <el-dropdown-menu slot="dropdown">
        <template v-for="(item, i) in getMenuEvents()">
          <el-dropdown-item :command="item.name"><i :class="item.icon"></i> {{item.label}}
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
  export default {
    name: 'KButtonMenus',
    props: {
      emitInParent: Boolean,
      round: Boolean,
      label: Boolean,
      group: Boolean,
      menuText: String,
      size: {
        type: String,
        required: false,
        default: 'mini'
      },
      data: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: false,
        default: -1
      },
      buttonList: {
        type: Array,
        required: false,
        default: null //[{name:'edit', icon:'delete', type:'danger'}]
      },
      menuList: {
        type: Array,
        required: false,
        default: null //['edit', 'insert']
      },
    },
    data() {
      return {
        hasButton: false,
        hasMenu: false,
        eventIconDic: {
          edit: {icon: 'el-icon-edit', label: '编辑'},
          insert: {icon: 'el-icon-plus', label: '新建'},
          'delete': {icon: 'el-icon-delete', label: '删除'},
          'batchDelete': {icon: 'el-icon-delete', label: '批量删除'},
          setting: {icon: 'el-icon-setting', label: '设置'},
          preview: {icon: 'el-icon-view', label: '预览'},
          inspect: {icon: 'el-icon-view', label: '检查'},
          more: {icon: 'el-icon-more', label: '更多'},
          menu: {icon: 'el-icon-menu', label: '菜单'},
          permission: {icon: 'el-icon-menu', label: '权限'},
          batch: {icon: 'el-icon-menu', label: '批量操作'},
          search: {icon: 'el-icon-search', label: '搜索'},
          info: {icon: 'el-icon-info', label: '信息'},
          mail: {icon: 'el-icon-message', label: '邮件'},
          close: {icon: 'el-icon-close', label: '关闭'},
          pass: {icon: 'el-icon-success', label: '通过'},
          phone: {icon: 'el-icon-mobile-phone', label: '电话'},
          buy: {icon: 'el-icon-mobile-goods', label: '购买'},
          mobile: {icon: 'el-icon-mobile-phone', label: '手机'},
          question: {icon: 'el-icon-question', label: '询问'},
          print: {icon: 'el-icon-mobile-printer', label: '打印'},
          time: {icon: 'el-icon-time', label: '时间'},
          schedule: {icon: 'el-icon-time', label: '定时'},
          refresh: {icon: 'el-icon-refresh', label: '刷新'},
          reload: {icon: 'el-icon-refresh', label: '重载'},
          reset: {icon: 'el-icon-refresh', label: '重置'},
          tickets: {icon: 'el-icon-tickets', label: '订单'},
          detail: {icon: 'el-icon-tickets', label: '详情'},
          remind: {icon: 'el-icon-bell', label: '提醒'},
          bell: {icon: 'el-icon-bell', label: '预定'},
          upload: {icon: 'el-icon-upload', label: '上传'},
          download: {icon: 'el-icon-download', label: '下载'},
          picture: {icon: 'el-icon-picture', label: '图片'},
          image: {icon: 'el-icon-picture-outline', label: '照片'},
          favorite: {icon: 'el-icon-star-on', label: '收藏'},
          warn: {icon: 'el-icon-warning', label: '警告'},
          alert: {icon: 'el-icon-warning', label: '提醒'},
          moveLeft: {icon: 'el-icon-d-arrow-left', label: '左移'},
          moveRight: {icon: 'el-icon-d-arrow-right', label: '右移'},
          share: {icon: 'el-icon-share', label: '分享'},
          relation: {icon: 'el-icon-share', label: '关联'},
        }
      }
    },
    created() {
      //init by finding the btnEvt_ mnuEvt_
      let vc = this
      let blist, mlist
      this.__mlist = null
      this.__blist = null
      while (vc) {
        if (vc._events) {
          for (let item in vc._events) {
            if (item.indexOf('mnuEvt_') === 0) {
              if (!mlist) {
                mlist = []
              }
              let name = item.substring(7);
              let icon = this.getIcon(name);
              icon.name = item;
              icon.type = this.getType(item);
              mlist.push(icon);
              this.hasMenu = true;
            }
            if (item.indexOf('btnEvt_') === 0) {
              if (!blist) {
                blist = []
              }
              let name = item.substring(7);
              let icon = this.getIcon(name);
              icon.type = this.getType(item);
              icon.name = item;

              this.hasButton = true
              blist.push(icon);


              continue;
            }
          }
        }
        if (this.hasButton || this.hasMenu) {
          this._topParent = vc
          this.__mlist = mlist
          this.__blist = blist
          break
        }
        vc = vc.$parent
      }
      if (!this._topParent) {
        this._topParent = this
      }
    },
    mounted() {
    },
    methods: {
      getButtonEvents() {
        return this.__blist
      },
      getMenuEvents() {
        return this.__mlist
      },
      doEvent(eventName) {
        //console.log(eventName, this.data, this.index)
        let d = this.data
        let name, msg
        if (eventName.toLowerCase().indexOf('delete') > 0) {
          if (eventName.indexOf('batchDelete') > 0) {
            msg = '确认删除这些选中的对象<br />是否继续?'
          } else {
            if (d) {
              name = d['name'] || d['label'] || d['desc'] || d['id'] || '';
              msg = '确认删除该项:<br /><strong style="line-height: 50px;color: red">' + name + '</strong><br />是否继续?'
            }
          }
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            center: true
          }).then(() => {
            this._topParent.$emit(eventName, this.data, this.index, eventName)
          }).catch(() => {
          });
        } else {
          this._topParent.$emit(eventName, this.data, this.index, eventName)
        }
      },
      getIcon(eventName, i) {
        let icon;
        let obj = this.eventIconDic[eventName]
        if (obj) {
          icon = Object.assign({}, obj)
        } else {
          icon = {icon: 'el-icon-setting', label: eventName}
        }
        return icon
      },
      getType(evtName) {
        if (evtName.toLowerCase().indexOf('delete') > 6) {
          return 'danger'
        }
        return 'primary'
      },
    },

  }
</script>
<style lang="scss">
</style>
