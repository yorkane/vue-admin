<template>
  <div>
    <template v-for="(item, index) in menus">
      <template v-if="!item.__children && item.is_hidden!=1">
        <router-link :to="getRouter(item)">
          <el-menu-item :index="item.name+index">
            <var :class="item.icon"></var><span>{{item.name}}</span>
          </el-menu-item>
        </router-link>
      </template>
      <el-submenu :index="item.name+index" v-if="item.__children && item.is_hidden != 1">
        <template slot="title">
          <var :class="item.icon"></var><span>{{item.name}}</span>
        </template>
        <template v-for="(child, index2) in item.__children">
          <template v-if="child.is_hidden !=1">
            <el-menu-item :index="index+child.name+'/'+index2" v-if="child.option_target=='_blank'">
              <a :href="getFullUrl(child)" target="_blank"><kbd
                :class="child.icon"></kbd><span>{{child.name}}</span></a>
            </el-menu-item>
            <router-link v-else :to="getRouter(child)">
              <el-menu-item :index="index+child.name+'/'+index2">
                <kbd :class="child.icon"></kbd><span>{{child.name}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </template>
      </el-submenu>
    </template>
    <router-link to="/url/退出/__logout_gate">
      <el-menu-item index="9999">
        <var class="k-ico-shutdown"></var><span>退出</span>
      </el-menu-item>
    </router-link>
  </div>
</template>

<script>

  export default {
    name: 'SideMenuItem',
    data() {
      return {}
    },
    props: {
      menus: {
        type: Array
      }
    },
    methods: {
      handleClick(item) {
        //console.log(item.href)
      },
      getFullUrl(item) {
        let url = item.href
        if (url.indexOf('http') < 0) {
          if (window.location.port > 8000) {  //for develop environment
            return window.location.protocol + "//" + window.location.hostname + '/' + url
          }
        }
        return url
      },
      getRouter(item) {
        let href = item.href;
        if (!href) {
          return '#'
        }

        if (href.indexOf('#') === 0) {
          href = href.substring(1, 2000)
          return href
        }
        if (href.indexOf('/') === 0) {
          href = href.substring(1, 2000)
        }
        //href = encodeURIComponent(href)
        return '/url/' + item.name + '/' + href;
        //return {path: href, name: 'Proxy'};
      }
    }

  }
</script>

