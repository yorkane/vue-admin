<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <div>
      <div>
        <el-radio-group v-model="layoutMode" size="medium" style="margin: 5px 5px 10px 5px;" @change="changeMode">
          <el-radio-button label="全屏编辑"></el-radio-button>
          <el-radio-button label="编辑比对"></el-radio-button>
          <el-radio-button label="核对修改"></el-radio-button>
        </el-radio-group>
        <el-switch v-model="diffFormate" active-text="逐行对比" inactive-text="并排对比" inactive-value="side-by-side"
                   active-value="line-by-line"></el-switch>
        <!--<el-button type="primary" @click="doCompare" size="medium">开始对比</el-button>-->
        <template v-if="!readOnly">
          <el-button @click="" size="medium">重置</el-button>
          <el-button @click="" size="medium">取消</el-button>
          <el-button type="primary" @click="save" size="medium">保存</el-button>
          {{currentVersion}}
        </template>
      </div>
        <el-container v-if="true">
          <el-aside :width="showRight ? '50%' : '100%'" ref="left" v-show="showLeft">
            <ace-editor ref="ace" v-model="newText"></ace-editor>
          </el-aside>
          <el-aside :width="showLeft ? '50%' : '100%'" ref="right" v-show="showRight">
            <diff-view :output-format="diffFormate" :old-text="oldText" :new-text="newText" ref="diff"
                       :file-name="displayName" height="2000"></diff-view>
          </el-aside>
        </el-container>
    </div>
  </k-wrap>
</template>
<script>
  import KWrap from "../../components/KWrap.vue";
  import DiffView from "../../components/diffView";
  import throttle from 'throttle-debounce/throttle';
  import AceDiff from "../../components/aceDiff";
  import AceEditor from "../../components/ace-editor";
  import textAPI from '../../api/sys_text_history'
  import AutoHeightWrapper from "../../components/AutoHeightWrapper";

  export default {
    name: 'textCompreTool',
    mixins: [KWrap],
    components: {
      AutoHeightWrapper,
      AceEditor,
      AceDiff,
      DiffView,
      KWrap,
    },
    props: {
      withDialog: {
        type: Boolean,
        default: false
      },
      leftText: String,
      rightText: String,
    },
    data: function () {
      this.tapi = textAPI.new()
      let that = this;
      this.doCompare = throttle(100, () => {
        setTimeout(() => {
          that.$refs.diff.doDiff()
        }, 200)
      });
      return {
        showRight: true,
        showLeft: true,
        layoutMode: '编辑比对',
        oldText: '',
        newText: '',
        outputHtml: '',
        displayName: '',
        readOnly: false,
        dataPO: {},
        currentVersion: '',
        diffFormate: 'side-by-side',
      }
    },
    mounted() {
      this.ace = this.$refs.ace
      let id = this.$route.params.id
      if(this.$route.params.left && this.$route.params.right) {
        let arr = this.tapi.getCache('compare')
        if (arr && arr.length === 4) {
          this.oldText = arr[0]
          this.newText = arr[1]
          this.displayName = arr[2].version + '|' + arr[3].version
          this.dataPO = arr[2]
          this.currentVersion = arr[2].version
        }
      } else if(id) {
        this.tapi.getLatestById(id).then(resp=>{
          let data = resp.data
          this.dataPO = data
          this.oldText = data.text
          this.newText = data.text
          this.currentVersion = data.version
          this.displayName = data.version
          // this.layoutMode = '全屏编辑'
          // this.changeMode()
          this.doCompare()
        })
      }
    },
    watch: {
      leftText(val) {
        this.oldText = val
      },
      rightText(val) {
        this.newText = val
      },
      oldText(val) {
        this.doCompare()
      },
      newText(val) {
        this.doCompare()
      },
      diffFormate(val) {
        this.doCompare()
      }
    },
    methods: {
      changeMode() {
        switch (this.layoutMode) {
          case '全屏编辑':
            this.showLeft = true
            this.showRight = false
            break;
          case '核对修改':
            this.showLeft = false
            this.showRight = true
            break;
          default:
            this.showLeft = true
            this.showRight = true
            break;
        }
        this.ace.resize()
      },
      save() {
        this.dataPO.text = this.newText
        this.tapi.update(this.dataPO).then(data => {
          this.$notify.info({title: '更新成功', message: data})
        })
      }
    }
  }
</script>
