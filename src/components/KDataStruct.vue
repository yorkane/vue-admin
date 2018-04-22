<script>
  import klib from '../klib/utils'

  export default {
    name: 'KDataStruct',
    data() {
      return {
        m_dataStruct: {
//          _FIELD_DIC: {},
//          statusDic: {},
//          optionsDic: {},
//          _FIELD_LIST: [],
//          _NAME: null,
//          _PK: 'id'
        },
        dataList: [],
        dataTree: {root: []},
        totalCount: 0,
      }
    },
    props: {
      dataStruct: Object,
      API: Object
    },
    watch: {
      dataStruct(val) {
        if (val._NAME) {
          //console.log('KDataStruct changed', val)
          this.m_dataStruct = val
        }
      }
    },
    computed: {
      api() {
        return this.API || this._api || this.$parent.API || this.$parent._api||this.$parent.$parent.API || this.$parent.$parent._api
      },
      data() {
        let a = this.api
        if (a && a.data) {
          return a.data()
        }
      }
    },
    created() {
      if (this.dataStruct) { //dataStruct injected, maybe not initialized
        if (this.dataStruct._NAME) {
          this.m_dataStruct = this.dataStruct
          console.debug(this.api.key, ' DataStruct load from prop', this.m_dataStruct)
          if (this.getData) {
            this.getData()
          }
          this.refreshRelatedFieldData(this.m_dataStruct)
          if (this.dataStructLoaded) {
            this.dataStructLoaded(this.dataStruct)
          }
        }
      } else if (this.api && this.api.getDataStruct) {
        console.debug(this.api.key, ' DataStruct Try to load from API')
        this.api.getDataStruct().then(data => {
          this.m_dataStruct = data
          if (this.getData) {
            this.getData()
          }
          this.refreshRelatedFieldData(data)
          if (this.dataStructLoaded) {
            this.dataStructLoaded(data)
          }
        })
      } else {
        this.m_dataStruct = klib.getParentDataStruct.call(this)
        console.debug(this.m_dataStruct._NAME, ' DataStruct load from parent', this.m_dataStruct)
        if (this.getData) {
          this.getData()
        }
        this.refreshRelatedFieldData(this.m_dataStruct)
        if (this.dataStructLoaded) {
          this.dataStructLoaded(this.m_dataStruct)
        }
      }
    },
    methods: {
      getById(id) {
        let a = this.api
        if (a && a.getById) {
          return a.getById(id, this.name)
        }
      },
      refreshRelatedFieldData(data) {
        let flist = data._FIELD_LIST
        let selfAPI = this.api
        if (!flist || !selfAPI || !selfAPI.new) return;
        for (let i = 0; i < flist.length; i++) {
          let fname = flist[i].Field;
          let inx = fname.indexOf('__')
          if (inx > 1) {
            fname = fname.substring(0, inx)
            let api = selfAPI.new(fname)
            if (api.key !== selfAPI.key) { //可执行的API
              if (api.isTree) { // 此API明确指定 Tree结构
                api.getTree()
              } else {
                //此API未明确指定 Tree结构，可能是初次载入，两个API接口都尝试一次
                //根据返回结果判定是否Tree结构
                api.getData()
                api.getTree()
              }
            }
          }
        }
      },
      // You can override this method to apply your own data initialization
      //dataStructLoaded(){
      //}
      // getData(params) {
      // console.log('abstract method getData not implemented! you should always override this method!')

//        if (this.api && this.api.getData) {
//          this.api.getData(params, this.$store).then(data => {
//            console.log(data)
//            this.dataList = data.list
//            this.totalCount = data.count
//          })
//        }
//       },
    }
  }
</script>
