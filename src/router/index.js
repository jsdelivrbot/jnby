import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Login from '@/Login'
import Home from '@/components/Home'
import configDex from '@/components/DedutConfig/configDex.vue'
import DedutConfig from '@/components/DedutConfig/DedutConfig.vue'
import IndexMgt from '@/components/indexMgt/indexMgt.vue'
import JxQuery from '@/components/jxQuery/jxQuery.vue'
import dzJxQuery from '@/components/jxQuery/dzjxQuery.vue'
import dqJxQuery from '@/components/jxQuery/dqjxQuery.vue'
import csJxQuery from '@/components/jxQuery/csjxQuery.vue'
import GuideDetail from '@/components/guideDetail/guideDetail.vue'
import CsdqGuideDetail from '@/components/guideDetail/csdqguideDetail.vue'
import HistoryData from '@/components/historyData/historyData.vue'
import StoreInquiry from '@/components/storeInquiry/storeInquiry.vue'
import StaffInquiry from '@/components/staffInquiry/staffInquiry.vue'
import unsubscribeList from '@/components/unsubscribeList/unsubscribeList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
    	children: [
    	//提成配置
    		{
    			path: '/configDex/:num',
		      name: 'configDex',
		      component: configDex
    		},
		    {
		      path: '/DedutConfig/:num',
		      name: 'DedutConfig',
		      component: DedutConfig
		    },
		      /*管理首页*/
		    {
		      path: '/indexMgt',
		      name: 'IndexMgt',
		      component: IndexMgt
		    },
		    /*绩效查询*/
		    {
		      path: '/JxQuery',
		      name: 'JxQuery',
		      component: JxQuery
		    },
				 /*绩效查询*/
				{
					path: '/dzJxQuery/:num',
					name: 'dzJxQuery',
					component: dzJxQuery
				},
				/*绩效查询*/
				{
					path: '/dqJxQuery',
					name: 'dqJxQuery',
					component: dqJxQuery
					},
					/*绩效查询*/
				{
					path: '/csJxQuery',
					name: 'csJxQuery',
					component: csJxQuery
				},
		    /*导购详情*/
		    {
		      path: '/guideDetail',
		      name: 'GuideDetail',
		      component: GuideDetail
				}, 
				/*导购详情*/
				{
					path: '/csdqGuideDetail',
					name: 'CsdqGuideDetail',
					component: CsdqGuideDetail
				}, 
		    /*历史绩效*/
		    {
		      path: '/historyData',
		      name: 'HistoryData',
		      component: HistoryData
		    },
		    //门店查询
		    {
		      path: '/storeInquiry',
		      name: 'StoreInquiry',
		      component: StoreInquiry
		    },
		    //员工查询
		    {
		      path: '/staffInquiry',
		      name: 'StaffInquiry',
		      component: StaffInquiry
		    },
		    //退订流水
		    {
		    	path: '/unsubscribeList',
		      name: 'unsubscribeList',
		      component: unsubscribeList
		    }
    ]
    }
  ]
})
