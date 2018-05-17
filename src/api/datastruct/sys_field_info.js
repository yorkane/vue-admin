const _M = {
  _OPTIONS: [],
  _PK: "id",
  _NAME: "sys_field_info",
  _DEFAULT: [],
  _STATUS: [],
  _FIELD_LIST: [
    {
      Field: "id",
      notNull: true,
      Key: "PRI",
      isPK: true,
      isInt: true,
      width: 11
    },
    {
      Field: "Field",
      notNull: true,
      Comment: "字段名",
      isText: true,
      width: 64
    },
    {
      Field: "_DB",
      Comment: "所属数据库",
      isText: true,
      width: 64
    },
    {
      Field: "_NAME",
      notNull: true,
      Comment: "所属数据表",
      isText: true,
      width: 64
    },
    {
      Field: "Comment",
      Comment: "字段备注",
      isText: true,
      width: 64
    },
    {
      Field: "info",
      Comment: "描述信息",
      isText: true,
      width: 500
    },
    {
      isIntBool: true,
      Field: "notNull",
      Comment: "能否为空"
    },
    {
      Field: "validate_regex",
      Comment: "正则验证",
      isText: true,
      width: 200
    },
    {
      Field: "validate_error",
      Comment: "验证错误信息",
      isText: true,
      width: 200
    },
    {
      Field: "grid_width",
      Comment: "表格宽度",
      isInt: true,
      width: 11
    }
  ],
  _DB: "approot",
  _COMMENT: "自定义字段信息"
}
export default _M
