<template>
	<div class="historyData-wrapper">
		<div class="col-md-10  mgt20 historyData-nav">
			<div class="col-md-6 am-ft-left">
				<a href="javascript:history.go(-1)" class="am-ft-14 am-ft-black"><返回</a>
			</div>
		</div>
		<div class="col-md-8 pd10 chars-position">
			<div class="chars-btn" v-if='lastCompare.length>0'>
				<button class="" @click='queryYear("1")' :class="{ active: type=='1' }">去年</button>
				<button  class="" @click='queryYear("2")' :class="{ active: type=='2' }">今年</button>
			</div>
			<div id="myChart" style="width:700px;height: 350px;"></div>
		</div>
		<div class="col-md-10 pd10 mgt10 yearCompare" v-for="monthSale in yearCompare">
			<div class="col-md-1 pt10 am-ft-black am-ft-16 yearStyle" >{{monthSale.tempTime}}</div>
			<div class="col-md-11 pd0">
				<div class="col-md-12 pd0" >
					<div class="col-md-1 ">
						<div class="numRank">{{monthSale.monthTime}}</div>
					</div>
					<div class="col-md-5 pd0 pt10 mgl-15">
							<span class="fn-left pl5 pr5">月</span>
							<div class="fn-left pl10 pr10 border-dd ">No.{{monthSale.salesRank}}</div>
							<div class="fn-left progress-box">
								<div class="progress-width" :style="{ width: monthSale.width + '%' }" ></div>
							</div>	
					</div>
					<div class="col-md-2 pd0">
						<p class="mgb0">提成</p>
						<p class="am-ft-20">￥{{monthSale.salary}}</p>
					</div>
					<div class="col-md-2 pd0">
						<p class="mgb0">销售额</p>
						<p class="am-ft-20">￥{{monthSale.salesCount}}</p>
					</div>
					<div class="col-md-2 pd0">
						<button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal" @click="orderDetail(monthSale.yearTime,monthSale.monthTime)">销售详情</button>
					</div>
				</div>	
			</div>
		</div>
		<!-- 模态框（Modal） -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog" style="width: 800px;">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
					</button>
					<h5 class="modal-title" id="myModalLabel">
						{{year}}年{{month}}月销售订单({{counts}})
					</h5>
				</div>
				<p v-show="counts == 0" class="am-ft-center mgt20 pb20">暂无数据</p>
				
				<div v-show="counts > 0" class="modal-body fn-clear">
					<div class="col-md-12">
						<table class="table  normall-table table-bordered guideDetail-table">
						  <thead>
						    <tr>
						      <th scope="col" width="17%">商品编号</th>
						      <th scope="col" width="25%">商品名称</th>
						      <th scope="col" width="12%">价格</th>
						      <th scope="col" width="12%">数量</th>
						      <th scope="col" width="15%">合计</th>
						      <th scope="col" width="15%">提成</th>
						    </tr>
						  </thead>
						  <tbody>
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
						      			  <td  width="17%" >{{detail.goodsCode}}</td>
									      <td  width="25%">{{detail.goodsName}}</td>
									      <td  width="12%">￥{{detail.goodsPrice}}</td>
									      <td  width="12%">{{detail.goodsCount}}件</td>
									      <td :rowspan="list.orderDetails.length" v-if='index== 0' width="15%">￥{{list.sumMoney}}</td>
									      <td :rowspan="list.orderDetails.length" v-if='index == 0' width="15%">￥{{list.salary}}</td>
						      		</tr>
						      	</table>
						      </td>
						    </tr>
						  </tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer" v-show='counts>0'>
					<!--分页-->
					<boot-page ref="page" :async="true" :len='5' :data="lists" :lens="lenArr" :url="url" :page-len="pageLen" :param="param" v-on:listenToChildEvent="showMsgFormChild"></boot-page>								
				</div>
			</div>
		</div>
	</div>
	</div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import bootPage from '../pagination.vue'
	export default {
		name: '',
		data() {
			return {
				employeeNum:this.$route.query.employeeNum,
				countList:[],
				thisCompare:[],//存放今年提成数组
				lastCompare:[],//存放去年提成数组
				yearCompare:[],//比较提成数组
				tempTime:'',//区分年份
				lastDataX:[],//存放去年数据
				lastDataY:[],
				dataX:[],//存放今年数据
				dataY:[],
				counts: '',
				type:'2',//默认显示今年
				thisYear:'',
				lastYear:'',
				year:'',//订单年份
				month:'',//订单月份
				lenArr: [10], // 每页显示长度设置
	            pageLen:10, // 可显示的分页数
	            url: 'http://dvtest.qineasy.com:8888/order/orderList', // 请求路径
	            param: { //员工详情入参
//		        	employeeNum: '8432',
		        	employeeNum: this.$route.query.employeeNum,
		        	queryTime: this.$route.query.queryTime,
		        	nub:'0',
		        	size:'5'
		        },
		        lists:[]
			}
		},
		created(){
			var date = new Date();
			this.thisYear=date.getFullYear();
			this.lastYear=date.getFullYear()-1;
			this.getCountList()
		},
		components: {
	        bootPage
	  	},
		methods: {
			refresh () {
           		var that = this;
	            that.$refs.page.refresh()
	        },
	        showMsgFormChild: function(data){
	            this.lists = data.list;	
	            this.counts = data.count;
	            console.log(this.counts)
			},
			orderDetail(year,month){
				var that = this
				that.year=year
				that.month=month
//				that.$nextTick(() => {
		       	 that.refresh()	        
//		      	})	
			},
			getCountList(){
				var that = this;
				that.$axios({
                    url: 'http://dvtest.qineasy.com:8888/salesCount/getSalesCountList', 
                    method: 'post',
                    params: {
                    	jsonObject: {
                    		// employeeNum:'DDDDD'
                 			employeeNum:that.employeeNum
                    	}
                    }
                })
				.then(function (response) {
			        that.countList = response.data.t
				        that.dataX=[];
						that.dataY=[];
				        that.lastDataX=[];
						that.lastDataY=[];
					//拆分数组并将提成（X轴）和月份（Y轴）提取出来	
					for(var item=0;item<that.countList.length;item++){
						if(that.countList[item].yearTime==that.thisYear){
							 that.thisCompare.push(that.countList[item])
							 that.dataX.push(that.countList[item].monthTime+'月');
					         that.dataY.push(that.countList[item].salesCount);
						}else{
							 that.lastCompare.push(that.countList[item])
							 that.lastDataX.push(that.countList[item].monthTime+"月");
					         that.lastDataY.push(that.countList[item].salesCount);
						}
					}
						if(that.thisCompare[0]){
						that.thisCompare[0].tempTime=that.thisCompare[0].yearTime;
							for(var j=0;j<that.thisCompare.length;j++){
								if(j>0){
									if(that.thisYear==that.thisCompare[j].yearTime){
										that.thisCompare[j].tempTime='';
									}
								}
							}
						}
				        //存放去年数据的数组
						if(that.lastCompare[0]){
							that.lastCompare[0].tempTime=that.lastCompare[0].yearTime;
							for(var j=0;j<that.lastCompare.length;j++){
								if(j>0){
									if(that.lastYear==that.lastCompare[j].yearTime){
										that.lastCompare[j].tempTime='';
									}
								}
							}
						}
			        	that.yearCompare=that.thisCompare
			        	that.yearCompare=that.maxSales(that.yearCompare)
			        	console.log(that.yearCompare)
			        	that.drawLine(that.dataX,that.dataY)
			    })
			      .catch(function (error) {
			        console.info(error)
			    })
			},
			//当月销售额与最大销售额的比例
			maxSales(arr){
				var max = arr[0].salesCount;
				var len = arr.length; 
				//获取最大值
				for (var i = 1; i < len; i++){ 
					if (Number(arr[i].salesCount) >Number(max) ) { 
						max = arr[i].salesCount; 
					} 
				}
				for(var v=0;v<len;v++){
	        		arr[v].width=arr[v].salesCount/max*100
	        		arr[v].width=arr[v].width.toFixed(2)
	        	}
				return arr;
			},
			queryYear(type){
				this.type=type
				/*type 1 去年 2今年*/
				if(type=="1"){
					this.yearCompare=[]
					this.yearCompare=this.lastCompare
					this.yearCompare=this.maxSales(this.yearCompare)
					this.drawLine(this.lastDataX,this.lastDataY)
				}else{
					this.yearCompare=[]
					this.yearCompare=this.thisCompare
					this.yearCompare=this.maxSales(this.yearCompare)
		   			this.drawLine(this.dataX,this.dataY)
				}
			},
			drawLine(dataX,dataY){
		        // 基于准备好的dom，初始化echarts实例
		        let myChart = this.$echarts.init(document.getElementById('myChart'));
		        // 绘制图表
		        myChart.setOption({
		            title: { text:'提成比例时间线比对图' },
		             tooltip: {
				        trigger: 'none',
				        axisPointer: {
				            type: 'cross'
				        }
				    },
		            xAxis: {
		                data: dataX
//		                 axisPointer: {
//		                 label: {
//		                    formatter: function (params) {
//		                        return '￥' + (params.seriesData.length ?params.seriesData[0].data : '');
//			                    }
//			                }
//			            }

		            },
		            yAxis: {
		            	 name: '销售额(元)',
//		            	show:false,  
		            	 splitLine:{  
				                        　　　　show:false  
				                        　　}  
		            },
		            series: [{
		                name: '销量',
		                type: 'line',
		                data: dataY
		            }]
		        });
		    }
		},
		events: {
//	         刷新数据
	        'refresh' () {
	            this.refresh()
	        }
	    }
	}
</script>
<style scoped="scoped">
	.guideDetail-nav{
		background: #ddd;
	    padding-top: 10px;
	    padding-bottom: 10px;
	}
	.guideDetail-table tr th,.guideDetail-table tr td{
		text-align: center;
	}
	.guideDetail-son-table tr td{
		padding: 7px;
	}
	.guideDetail-son-table{
		margin-bottom: 7px;
	}
	.order-nav{
		color: #1c7bca;
	    background: #ddd;
	    padding: 7px;
	}
	.chars-position{
		position: relative;
	}
	.chars-btn{
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 1;
	}
	.chars-btn button.active{
		float: left;
	    border: 1px solid #aaa;
	    color: #fff;
	    background: #aaa;
	     padding: 3px 15px;
	}
	.chars-btn button{
		float: left;
	    border: 1px solid #ddd;
	    background: #fff;
	    padding: 3px 15px;
	}
	.mgl-15{
		margin-left: -15px;
	}
	.border-black{
		border: 1px solid #000;
	}
	.progress-box{
		width: 70%;
	}
	.progress-width{
		width:100%;
	    padding: 10px;
	    border: 1px solid #337AB7;
	    border-radius: 2px;
	    background: #337AB7;
	}
	.numRank{
	    background: #ff6600;
	    border-radius: 50%;
	    width: 40px;
	    color: #fff;
	    height: 40px;
	    text-align: center;
	    line-height: 40px;
	    font-size: 20px;
	}
	.border-dd{
		border: 1px solid #DDDDDD;
	}
	.order-nav{
		background: #f4f4f4;
   		color: #666;
	    padding: 7px;
	}
	.modal-body{
	    max-height: 500px;
	    overflow: auto;		
	}
</style>