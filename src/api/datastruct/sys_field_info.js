const _M = {
  _FIELD_LIST: [
    {
      width: 11,
      Key: "PRI",
      notNull: true,
      isInt: true,
      Field: "id",
      isPK: true
    },
    {
      width: 64,
      Field: "Field",
      is_readonly: true,
      Comment: "字段名",
      isText: true,
      notNull: true
    },
    {
      width: 64,
      Field: "_DB",
      is_readonly: true,
      Comment: "所属数据库",
      isText: true,
      notNull: true
    },
    {
      width: 64,
      Field: "_NAME",
      is_readonly: true,
      Comment: "所属数据表",
      isText: true,
      notNull: true
    },
    {
      width: 64,
      isText: true,
      grid_width:200,
      Comment: "字段备注",
      Field: "Comment"
    },
    {
      width: 500,
      grid_width:200,
      isText: true,
      Comment: "描述信息",
      Field: "info"
    },
    {
      Comment: "能否为空",
      isIntBool: true,
      Field: "notNull"
    },
    {
      width: 200,
      isText: true,
      Comment: "正则验证",
      Field: "validate_regex"
    },
    {
      width: 200,
      Field: "validate_error",
      hide_in_form: false,
      Comment: "验证错误信息",
      isText: true,
      hide_in_grid: true
    },
    {
      width: 11,
      Comment: "表格宽度",
      isInt: true,
      Field: "grid_width"
    },
    {
      Comment: "表格中不显示",
      isIntBool: true,
      Field: "hide_in_grid"
    },
    {
      Comment: "表单中不显示",
      isIntBool: true,
      Field: "hide_in_form"
    },
    {
      Comment: "禁止编辑",
      isIntBool: true,
      Field: "is_readonly"
    }
  ],
  _PK: "id",
  _DEFAULT: [ ],
  _STATUS: [ ],
  _NAME: "sys_field_info",
  _OPTIONS: [ ],
  _COMMENT: "自定义字段信息",
  _DB: "approot"
}
export default _M
