export default {
  getData(url) {
    let dt = this.data[url]
    if(!dt) {
      for (let key in this.data) {
        if(url.indexOf(key) >= 0) {
          dt = this.data[key]
        }
      }
    }
    return dt
  },
  data:
    {
      'lor/sys_user/desc':
        {
          _STATUS: {
            status: [
              {
                label: "未验证",
                id: -10
              },
              {
                label: "已经无效",
                id: -5
              },
              {
                label: "有效期内",
                id: 5
              },
              {
                label: "已验证",
                id: 10
              }
            ],
            base:
              [
                {
                  label: "登出",
                  id: -12
                },
                {
                  label: "不可用",
                  id: -11
                },
                {
                  label: "未验证",
                  id: -10
                },
                {
                  label: "关闭",
                  id: -9
                },
                {
                  label: "维护中",
                  id: -8
                },
                {
                  label: "已结束",
                  id: -7
                },
                {
                  label: "离线",
                  id: -6
                },
                {
                  label: "已经无效",
                  id: -5
                },
                {
                  label: "临时不可用",
                  id: -4
                },
                {
                  label: "故障",
                  id: -3
                },
                {
                  label: "隐藏",
                  id: -2
                },
                {
                  label: "已删除",
                  id: -1
                },
                {
                  label: "停用",
                  id: 0
                },
                {
                  label: "启用",
                  id: 1
                },
                {
                  label: "可见",
                  id: 2
                },
                {
                  label: "正常",
                  id: 3
                },
                {
                  label: "临时可用",
                  id: 4
                },
                {
                  label: "有效期内",
                  id: 5
                },
                {
                  label: "在线",
                  id: 6
                },
                {
                  label: "进行中",
                  id: 7
                },
                {
                  label: "恢复中",
                  id: 8
                },
                {
                  label: "打开",
                  id: 9
                },
                {
                  label: "已验证",
                  id: 10
                },
                {
                  label: "可用",
                  id: 11
                },
                {
                  label: "登录",
                  id: 12
                }
              ]
          }
          ,
          _OPTIONS: [],
          _PK:
            "id",
          _FIELD_LIST:
            [
              {
                width: 11,
                Key: "PRI",
                Comment: "ID",
                isPK: true,
                isInt: true,
                Field: "id",
                Extra: "auto_increment"
              },
              {
                isUNI: true,
                width: 20,
                Key: "UNI",
                isText: true,
                Comment: "用户名",
                Field: "name"
              },
              {
                isUNI: true,
                width: 40,
                Key: "UNI",
                isText: true,
                Comment: "邮箱",
                Field: "email"
              },
              {
                width: 30,
                isText: true,
                Null: true,
                Comment: "个人描述",
                Field: "desc"
              },
              {
                width: 11,
                Comment: "所属组织",
                Null: true,
                isInt: true,
                Field: "org_id"
              },
              {
                width: 16,
                isText: true,
                Null: true,
                Comment: "手机号码",
                Field: "phone"
              },
              {
                width: 20,
                isText: true,
                Null: true,
                Comment: "密码",
                Field: "password"
              },
              {
                width: 8,
                isText: true,
                Null: true,
                Comment: "密码盐",
                Field: "salt"
              },
              {
                width: 16,
                isText: true,
                Null: true,
                Comment: "用户密钥",
                Field: "key"
              },
              {
                width: 8,
                Comment: "角色",
                Null: true,
                isInt: true,
                Field: "role"
              },
              {
                width: 2,
                Comment: "等级",
                Null: true,
                isInt: true,
                Field: "level",
                Default: 0
              },
              {
                width: 4,
                isStatus: true,
                Comment: "用户状态",
                Null: true,
                Field: "status",
                Default: "-10"
              },
              {
                isDate: true,
                Null: true,
                Comment: "创建时间",
                Field: "create_time",
                Default: "CURRENT_TIMESTAMP"
              },
              {
                isDate: true,
                Null: true,
                Comment: "最后登录时间",
                Field: "last_login"
              },
              {
                isDate: true,
                Null: true,
                Comment: "最后修改时间",
                Field: "last_modify",
                Extra: "on update CURRENT_TIMESTAMP"
              },
              {
                isIntBool: true,
                Comment: "删除标记",
                Null: true,
                Field: "is_deleted",
                Default: 0
              },
              {
                isIntBool: true,
                Comment: "禁用",
                Null: true,
                Field: "is_disabled",
                Default: 0
              },
              {
                width: 255,
                isText: true,
                Null: true,
                Comment: "备用2",
                Field: "ext1"
              },
              {
                width: 255,
                isText: true,
                Null: true,
                Comment: "备用2",
                Field: "ext2"
              },
              {
                width: 255,
                isText: true,
                Null: true,
                Comment: "备用3",
                Field: "ext3",
                Default: ""
              }
            ]
        },
      'lor/sys_user/list':
        {
          count: 2,
          list:
            [
              {
                ext1: null,
                salt: "xddf21",
                phone: "3232322221111111",
                id: 2,
                org_id: 1,
                password: null,
                role: 0,
                last_modify: "2017-09-25 18:41:07",
                last_login: null,
                ext3: "",
                level: 0,
                create_time: "2017-09-25 13:19:33",
                status: -10,
                email: "liuxb2@wasu.com",
                desc: "运维111",
                ext2: null,
                is_disabled: 1,
                is_deleted: 1,
                name: "liuxb2",
                key: "GQ4DMNLCMQZWIMLF"
              },
              {
                ext1: null,
                salt: "xddf21",
                phone: null,
                id: 1,
                org_id: 1,
                password: null,
                role: null,
                last_modify: "2017-09-25 16:34:58",
                last_login: null,
                ext3: "",
                level: 0,
                create_time: "2017-09-25 13:19:33",
                status: -10,
                email: "liuxb@wasu.com",
                desc: "运维",
                ext2: null,
                is_disabled: 1,
                is_deleted: 0,
                name: "liuxb",
                key: "GQ4DMNLCMQZWIMLF"
              }
            ]
        }
    }

}
