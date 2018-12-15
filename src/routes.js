import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/chairman/Home.vue'
import msg from './views/chairman/nav1/msg.vue'
import dsHome from './views/distributor/Home.vue'
import dsTable from './views/distributor/Table.vue'
import dsMsg from './views/distributor/msg.vue'
import Main from './views/Main.vue'
import cmTable from './views/chairman/nav1/Table.vue'
import examine from './views/chairman/nav1/examine.vue'
import Page4 from './views/chairman/nav2/Page4.vue'
import Page5 from './views/chairman/nav2/Page5.vue'
import Page6 from './views/chairman/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    { path: '/main', component: Main },
    {
        path: '/chairman',
        component: Home,
        name: '图书管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/chairman/main', component: Main, name: '主页', hidden: true },
            { path: '/chairman/table', component: cmTable, name: '图书' },
            { path: '/chairman/examine', component: examine, name: '审核' },
        ]
    },
    {
      path: '/distributor',
      component: dsHome,
      name: '图书管理',
      leaf: true,//只有一个节点
      iconCls: 'el-icon-message',//图标样式class
      children: [
          { path: '/distributor/table', component: dsTable, name: '图书管理' },
      ]
    },
    {
      path: '/distributor',
      component: dsHome,
      name: '留言',
      leaf: true,//只有一个节点
      iconCls: 'el-icon-message',//图标样式class
      children: [
          { path: '/distributor/msg', component: dsMsg, name: '留言' },
      ]
    },
    {
      path: '/chairman',
      component: Home,
      name: '留言',
      leaf: true,//只有一个节点
      iconCls: 'el-icon-message',//图标样式class
      children: [
          { path: '/chairman/msg', component: msg, name: '留言' },
      ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    // {
    //     path: '*',
    //     hidden: true,
    //     redirect: { path: '/404' }
    // }
];

export default routes;