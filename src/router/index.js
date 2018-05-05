import Vue from 'vue'
import Router from 'vue-router'
import GuildReport from '@/components/GuildReport'
import FetchRecord from '@/components/FetchRecord'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'GuildReport',
      component: GuildReport
    }, {
      path: '/record',
      name: 'FetchRecord',
      component: FetchRecord
    }
  ]
})
