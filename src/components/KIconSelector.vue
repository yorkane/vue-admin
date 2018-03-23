<template>
  <div class="kicoWrap">
    <el-popover
      ref="popoverIcon"
      placement="right"
      width="520"
      trigger="click"
      v-model="showPopover">
      <div class="kICSWrap">
        <el-select v-model="iconType" placeholder="请选择">
          <el-option value="sys" label="系统默认"></el-option>
          <!--<el-option value="svg" label="svg图标"></el-option>-->
          <el-option value="extend" label="扩展"></el-option>
        </el-select>
        <template v-for="item in getIconList()">
          <div :class="getClass(item)" @click="select(item)">
            <i :class="item" v-if="iconType!='svg'"></i>
            <icon-svg v-if="iconType=='svg'" :icon-class="item"/>
            <span>{{item}}</span>
          </div>
        </template>
      </div>
    </el-popover>
    <div class="preview">
      <el-button round type="primary" :icon="value" v-popover:popoverIcon @click="showPop">选择图标</el-button>
      <var :class="value"></var><a>{{value}}</a>
    </div>
  </div>
</template>
<script>
  import IconSvg from "./Icon-svg/index.vue";

  export default {
    components: {IconSvg},
    name: 'KIconSelector',
    data() {
      return {
        iconType: '',
        showPopover: false,
        svgList: [
          "404", "email", "table", "yanjing", "EXCEL", "from", "theme", "yonghuming", "QQ", "icons", "tubiao", "zonghe", "a", "mima", "tuozhuai", "zujian", "b", "quanxian", "weixin", "bug", "shouce", "wujiaoxing", "c", "tab", "xinrenzhinan"],
        sysList: ["el-icon-upload", "el-icon-error", "el-icon-success", "el-icon-warning", "el-icon-sort-down", "el-icon-sort-up", "el-icon-arrow-left", "el-icon-circle-plus", "el-icon-circle-plus-outline", "el-icon-arrow-down", "el-icon-arrow-right", "el-icon-arrow-up", "el-icon-back", "el-icon-circle-close", "el-icon-date", "el-icon-circle-close-outline", "el-icon-caret-left", "el-icon-caret-bottom", "el-icon-caret-top", "el-icon-caret-right", "el-icon-close", "el-icon-d-arrow-left", "el-icon-check", "el-icon-delete", "el-icon-d-arrow-right", "el-icon-document", "el-icon-d-caret", "el-icon-edit-outline", "el-icon-download", "el-icon-goods", "el-icon-search", "el-icon-info", "el-icon-message", "el-icon-edit", "el-icon-location", "el-icon-loading", "el-icon-location-outline", "el-icon-menu", "el-icon-minus", "el-icon-bell", "el-icon-mobile-phone", "el-icon-news", "el-icon-more", "el-icon-more-outline", "el-icon-phone", "el-icon-phone-outline", "el-icon-picture", "el-icon-picture-outline", "el-icon-plus", "el-icon-printer", "el-icon-rank", "el-icon-refresh", "el-icon-question", "el-icon-remove", "el-icon-share", "el-icon-star-on", "el-icon-setting", "el-icon-circle-check", "el-icon-service", "el-icon-sold-out", "el-icon-remove-outline", "el-icon-star-off", "el-icon-circle-check-outline", "el-icon-tickets", "el-icon-sort", "el-icon-zoom-in", "el-icon-time", "el-icon-view", "el-icon-upload2", "el-icon-zoom-out"],
        extendList: [
          "k-ico-list","k-ico-projector", "k-ico-tv", "k-ico-notebook", "k-ico-id-card", "k-ico-file", "k-ico-edit", "k-ico-plan", "k-ico-delete", "k-ico-paste", "k-ico-search", "k-ico-people", "k-ico-add", "k-ico-storage", "k-ico-account", "k-ico-xiai", "k-ico-subscribe", "k-ico-html5", "k-ico-rocket", "k-ico-tag", "k-ico-crown", "k-ico-driver", "k-ico-android", "k-ico-cash", "k-ico-card", "k-ico-chart", "k-ico-key", "k-ico-browser", "k-ico-linux", "k-ico-cash1", "k-ico-chart4", "k-ico-chart7", "k-ico-product", "k-ico-collection", "k-ico-ott", "k-ico-stb", "k-ico-style", "k-ico-win", "k-ico-code", "k-ico-org", "k-ico-stash", "k-ico-send", "k-ico-app", "k-ico-global", "k-ico-task", "k-ico-camera", "k-ico-tool", "k-ico-shutdown", "k-ico-point", "k-ico-shield", "k-ico-schedule", "k-ico-download", "k-ico-structure", "k-ico-migration", "k-ico-data-stream", "k-ico-more", "k-ico-radar", "k-ico-comments", "k-ico-heartbeat", "k-ico-plug", "k-ico-sliders", "k-ico-phone", "k-ico-pages", "k-ico-eprofile-data", "k-ico-bi-data", "k-ico-porana-data", "k-ico-re-data", "k-ico-ios", "k-ico-lock", "k-ico-flow", "k-ico-server2", "k-ico-deliver", "k-ico-middleware", "k-ico-monitor", "k-ico-reroute", "k-ico-tuning", "k-ico-chart6", "k-ico-books", "k-ico-server1", "k-ico-filter", "k-ico-gift", "k-ico-qrcode", "k-ico-catalog", "k-ico-fill", "k-ico-supply", "k-ico-production", "k-ico-org1", "k-ico-treenode",
        ]
      }
    },
    props: {
      value: String,
      type: {
        type: String,
        required: false,
        default: 'sys'
      }
    },
    computed: {
      iconList() {

      }
    },
    created() {
      this.iconType = this.type;
    },
    mounted() {
    },
    methods: {
      getIconList() {
        switch (this.iconType) {
          case 'extend':
            return this.extendList
          case 'svg':
            return this.svgList
          case 'sys':
            return this.sysList
          default:
            return this.extendList
            break;
        }
      },
      getClass(item) {
        if (item === this.value) {
          return "icon select"
        }
        return "icon"
      },
      select(item) {
        this.$emit('input', item)
        this.showPopover = false;
        console.log(item)
      },
      showPop() {
        let that = this;
        setTimeout(() => {
          that.showPopover = true
        }, 1)
      }
    }
  }
</script>
<style lang="scss">
  .kICSWrap {
    height: 410px;
    overflow-y: scroll;
    .el-select {
      width: 130px;
      float: left;
      margin: 0 5px 0 0;
    }
    div.icon {
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      border: 2px solid #FFFFFF;
      background-color: #FFF;
      display: inline-block;
      padding: 2px;
      width: 68px;
      height: 68px;
      i, svg {
        margin: 2px auto;
        width: 24px;
        height: 24px;
        display: block;
        font-size: 24px;
      }
      span {
        width: 58px;
        text-align: center;
        word-wrap: break-word;
        display: block;
        font-size: 11px;
        line-height: 12px;
        height: 34px;
        overflow: hidden;
        margin: 0 auto;
      }
    }
    .icon:hover {
      background: #409EFF;
      color: #FFF;
    }
    div.select {
      border: 2px solid #1f2d3d;
      background: #eee;
    }
  }

  .kicoWrap {
    button {
      float: left;
    }
    .preview var {
      font-size: 40px;
      line-height: 40px;
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    a {
      font-size: 14px;
    }
  }

</style>
