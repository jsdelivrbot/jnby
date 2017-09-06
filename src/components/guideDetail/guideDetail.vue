<template>
	<div class="guideDetail-wrapper">
		<div class="col-md-10 mgt20 guideDetail-nav">
			<div class="col-md-6 am-ft-left">
				<span class="am-ft-14">{{param.employeeName}}，您本月的销售排名是</span>
				<span class="am-ft-20">{{salesRank}}</span>
				<span class="am-ft-14">请继续加油哦！</span>
			</div>
			<div class="col-md-6 am-ft-right queryBtn">
				<router-link :to="{name:'HistoryData',query:param}">查看历史绩效</router-link>
			</div>
		</div>
		<div class="col-md-10 pd10">
			<div class="col-md-4">
				<p class="mgb0">本月销售额</p>
				<p class="am-ft-black">
					<span class="am-ft-14">￥</span>
					<span class="am-ft-24">{{salesCount}}</span>
				</p>
			</div>
			<div class="col-md-3">
				<p class="mgb0">当前提成系数</p>
				<p class="am-ft-black">
					<span class="am-ft-24">{{ratio}}</span>
					<span class="am-ft-14">%</span>
				</p>
			</div>
			<div class="col-md-4">
				<p class="mgb0">本月预计提成</p>
				<p class="am-ft-black">
					<span class="am-ft-14">￥</span>
					<span class="am-ft-24">{{(salesCount*ratio/100).toFixed(2)}}</span>
				</p>
			</div>
		</div>
		<div class="col-md-10">
			<div class="col-md-12 pb10">
				<span class="fn-left">本月销售订单({{counts}})</span>
			</div>
			<div class="col-md-12">
				<table class="table table-hover normall-table table-bordered guideDetail-table">
				    <tr>
				      <th scope="col" width="17%">商品编号</th>
				      <th scope="col" width="25%">商品名称</th>
				      <th scope="col" width="12%">价格</th>
				      <th scope="col" width="12%">数量</th>
				      <th scope="col" width="15%">合计</th>
				      <th scope="col" width="15%">提成</th>
				    </tr>
				    <tr v-for="list in lists">
				      <td colspan="6" class="pd0">
				      	<table class="w100 guideDetail-son-table">
				      		<tr>
				      			<td colspan="6" class="order-nav">
				      				<span class="fn-left">订单编号：{{list.orderId}}</span>
				      				<span class="fn-right">{{list.orderTime}}</span>
				      			</td>
				      		</tr>
				      		<tr v-for='(detail,index) in list.orderDetails' track-by="$index">
				      			  <td  width="17%">{{detail.goodsCode}}</td>
							      <td  width="25%">{{detail.goodsName}}</td>
							      <td  width="12%">￥{{detail.goodsPrice}}</td>
							      <td  width="12%">{{detail.goodsCount}}件</td>
							      <td :rowspan="list.orderDetails.length" v-if='index== 0' width="15%">￥{{list.sumMoney}}</td>
							      <td :rowspan="list.orderDetails.length" v-if='index == 0' width="15%">￥{{list.salary}}</td>
				      		</tr>
				      	</table>
				      </td>
				    </tr>
				</table>
				<!--分页-->
				<div v-show='counts>0'>
					<button class="btn btn-default fn-left" @click="refresh">刷新</button>
					<boot-page ref="page" :async="true" :len='5' :data="lists" :lens="lenArr" :url="url" :page-len="pageLen" :param="param" v-on:listenToChildEvent="showMsgFormChild"></boot-page>								
				</div>
				<!--/分页-->	
				<div v-show="counts==0">
					<p class="text-muted am-ft-center mgt20">暂无数据</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import bootPage from '../pagination.vue'	
	export default {
		name: '',
		data() {
			return {
				counts: '',
				lenArr: [10], // 每页显示长度设置
	            pageLen:10, // 可显示的分页数
	            url: 'http://dvtest.qineasy.com:8888/order/orderList', // 请求路径
				param: { //员工详情入参
		        	employeeNum: '',
					queryTime: '',
		        	nub:'0',
		        	size:'10'
		        },
		        param2: {
		        	monthTime: '',
		        	yearTime: '',
		        	employeeNum: ''
//		        	employeeNum: JSON.parse(sessionStorage.userInfo)[0].employeeNum
		        },
		        salesCount: '',
		        salesRank: '',
		        employeeName: JSON.parse(sessionStorage.userInfo)[0].employeeName,
		        ratio: '',
		        lists: [], // 分页组件传回的分页后数据 
		        userTy: JSON.parse(sessionStorage.userInfo)[0].type,
		        dateObj: null
			}
		},
		created(){
			this.$nextTick(() => {
	       	 this.refresh()	        
	       	 this.getSalesCount()
	      	})	
			this.dateObj=this.getdate()
			this.param.queryTime = JSON.stringify(this.dateObj.year)+this.dateObj.month;
			this.param.employeeName=this.$route.query.employeeName
			console.log(JSON.parse(sessionStorage.userInfo)[0].type)
			if(JSON.parse(sessionStorage.userInfo)[0].type==1){
				this.param.employeeNum=JSON.parse(sessionStorage.userInfo)[0].employeeNum
				this.param2.employeeNum=JSON.parse(sessionStorage.userInfo)[0].employeeNum
			}else{
				this.param.employeeNum=this.$route.query.employeeNum
				this.param2.employeeNum=this.$route.query.employeeNum
			}
		},
		components: {
	        bootPage
	  	},
		methods: {	
			getdate (){
				let obj;
				var data = new Date();
				let month = data.getMonth()+1;
				let year = data.getFullYear();
				if(month<10){
					month = '0'+ month
				}else{
					month = month
				}
				obj = {
					year: year,
					month: month
				}
				return obj
			},
		  	refresh () {
           		var that = this;
	            that.$refs.page.refresh()
	        },
	        showMsgFormChild: function(data){
	        	  this.lists = data.list;	
			      this.counts = data.count;
			},
			getSalesCount(){
				var that = this;
				that.param2.monthTime = that.dateObj.month;
				that.param2.yearTime = JSON.stringify(that.dateObj.year);
				console.log(that.param2)
				that.$axios({
                    url: 'http://dvtest.qineasy.com:8888/salesCount/getSalesCount', 
                    method: 'post',
                    params: {
                    	jsonObject: that.param2
                    }
                })
				.then(function (response) {
//					console.info(that.param2)
					if(response.data.t != null){
						that.salesCount = response.data.t.salesCount
						that.salesRank = response.data.t.salesRank
						that.ratio = response.data.t.ratio
					}else{
						that.salesCount = 0
						that.salesRank = 0
						that.ratio = 0
					}
					
			    })
			      .catch(function (error) {
			        console.info(error)
			    })
			}
			
		},
		events: {
	        // 刷新数据
	        'refresh' () {
	            this.refresh()
	        }
	    }
	}
</script>
<style scoped>
	.guideDetail-nav{
		background: #F4F4F4;
	    padding-top: 10px;
	    padding-bottom: 10px
	}
	.guideDetail-table tr th,.guideDetail-table tr td{
		text-align: center;
	}
	.guideDetail-son-table tr td{
		padding-top: 7px;
	}
	.guideDetail-son-table{
		margin-bottom: 10px;
	}
	.order-nav{
		background: #f4f4f4;
   		color: #666;
	    padding: 7px;
	}
	.queryBtn{
		padding-top: 4px;
	}
	.queryBtn a{
		padding: 5px 10px;
	    border: 1px solid #aaa;
	    border-radius: 4px;
	    color: #666;
	}
</style>