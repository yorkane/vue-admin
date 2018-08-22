<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <div>
      <auto-height-wrapper height="100%">
        <div class="tree" style="float:left;border-right:1px solid #dfe6ec;width:200px;">
          <div style="margin: 10px;">
            <!--<el-radio-group v-model="layoutMode" size="medium" style="margin: 5px 5px 10px 5px;" @change="changeMode">-->
            <!--<el-radio-button label="全屏编辑"></el-radio-button>-->
            <!--<el-radio-button label="编辑比对"></el-radio-button>-->
            <!--<el-radio-button label="核对修改"></el-radio-button>-->
            <!--</el-radio-group>-->
            <!--<el-button type="primary" @click="doCompare" size="medium">开始对比</el-button>-->
            <template>
              <!--<el-button @click="" size="small" round>重置</el-button>-->
              <!--<el-button @click="" size="small" round>取消</el-button>-->
              <el-button type="primary" @click="saveFile" size="small" round>保存</el-button>
              <span style="font-size: 14px">自动载入</span>
              <el-switch v-model="auto_reload"></el-switch>
            </template>
          </div>
          <el-tree v-bind:loading="file_loading" :data="regions" :props="props" :load="loadNode" lazy
                   @node-click="handleNodeClick"
                   @check-change="handleCheckChange">
          </el-tree>
        </div>
        <!--<auto-height-wrapper>-->
        <ace-editor ref="ace" @save="saveFile" v-model="codeContent" width="auto"></ace-editor>
        <!--</auto-height-wrapper>-->
      </auto-height-wrapper>
      <!--<ace-diff :old-text="oldText" new-text="newText"></ace-diff>-->
    </div>
  </k-wrap>
</template>
<script>
  import axios from 'axios'
  import AceEditor from "../../components/ace-editor";
  import AutoHeightWrapper from "../../components/AutoHeightWrapper";
  import KWrap from "../../components/KWrap";

  export default {
    name: 'CodeEditor',
    components: {
      KWrap,
      AutoHeightWrapper,
      AceEditor
    },
    mixins: [KWrap],
    props: {
      withDialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        codeContent: '2342343',
        activeIndex: '1',
        activeIndex2: '1',
        dialog_show: false,
        file_saving: false,
        file_loading: false,
        loading: false,
        saveBtnText: '保存',
        auto_reload: false,
        filename: "html/_view/code.htm",
        regions: [{
          'name': 'regio2221',
          'hasChild': true
        }, {
          'name': 'region2'
        }],
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        fileHistory: [
          'approot/test.lua',
          'html/auth.htm',
          'conf/nginx.conf',
          'conf/proxy_list.conf'
        ]
      }
    },
    created() {
    },
    watch: {
      // 如果 filename 发生改变，这个函数就会运行
      filename(newName) {
        this.loadFile(newName);
      },
      auto_reload(val) {
        if (val) {
          this.autoReload()
        }
      }
    },
    methods: {
      autoReload() {
        if (this.auto_reload) {
          setTimeout(() => {
            this.loadFile(null, true);
            this.autoReload(true)
          }, 5000);
        }
        // this.auto_reload = this.auto_reload ? false : true;
      },
      addFileHistory(fName) {
        for (var index = 0; index < this.fileHistory.length; index++) {
          var file = this.fileHistory[index];
          if (file == fName) return;
        }
        this.fileHistory.push(fName)
      },
      loadFile(fname, toEnd) {
        let editor = this.$refs.ace
        fname = fname || this.filename;
        if (this.file_loading || this.file_saving) return;
        this.file_loading = true;
        axios.get('/_console/file?f=' + fname).then(res => {
          let txt = res.data;
          // this.codeContent = txt
          setTimeout(() => {
              this.file_loading = false
            },
            200);
          editor.setValue(txt);
          if (toEnd) {
            var row = editor.getLength() - 1
            editor.moveTo(row, 0)
          } else {
            editor.moveTo(0, 0)
          }
          if (txt != 'nil') {
            this.addFileHistory(fname);
            this.$notify.success({title: '成功', message: fname + '文件载入完毕', duration: 1000});
          } else {
            this.$notify.error({title: '错误', message: fname + '文件载入失败，文件不存在'});
          }
          let inx = fname.lastIndexOf('.')
          let mode = fname.substr(inx + 1, fname.length)
          try {
            editor.setMode(mode);
          } catch (e) {
          }
        }).catch(res => {
          console.log(res)
          this.file_loading = false;
          this.$notify.error({title: '错误', message: '服务器响应错误'});
        })
      },
      saveFile(text) {
        if (!text) {
          text = this.codeContent;
        }
        let editor = this.$refs.ace
        if (this.file_saving) return;
        this.file_saving = true;
        // var txt = encodeURIComponent('content') + "=" + encodeURIComponent(editor.getValue());
        axios.post('/_console/file?f=' + this.filename, text).then(res => {
          setTimeout(() => {
              this.file_saving = false
            },
            200);
          console.log(res)

          let msg = res.data;
          if (msg.indexOf('ok') > -1) {
            this.$notify.success({title: '提示', message: (this.filename + ' 写入成功')});
          }
          else {
            this.$notify.error({title: '错误', message: msg + '可能是应用没有文件写入权限'});
          }
          // resolve([{ name: 'region1', hasChild:true }, { name: 'region2' }])
        }).catch(res => {
          this.file_saving = false;
          this.$notify.error({title: '错误', message: '文件载入错误'});
        })
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        if (!data.isFile || this.file_loading) return;
        var fname = data.path + data.name;
        this.filename = fname;
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          node.data.isFile = false;
          node.data.name = ''
        }
        if (!node.data.isFile) {
          var pt = node.data.path || '';
          var url = '/_console/dir?p=' + pt + node.data.name
          axios.get(url).then(res => {
            let data = res.data;
            if (!data.length) {
              data = []
            }
            resolve(data)
          }).catch(res => {
            //console.log(res)
            this.$notify.error({title: '错误', message: '数据载入失败'});
          });
        } else {
          if (node.data.type === 'file') {
          }
          return resolve([]);
        }
      }
    }
  }
</script>
<style>

</style>
