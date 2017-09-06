<template>
	<div>
		<publicMenu :list="fourList"></publicMenu>		
		<tip :list="wslist" :isShow="isShow" v-on:listenToChildEvent="getIsShow"></tip>
	</div>
</template>
<script>
	import publicMenu from './Menu.vue'	
	import tip from './tip.vue'	
	export default {
		name: '',
		data () {
		  	return {
				wslist:'',
				isShow:false,
				fourList:[]
			  }
		 },
		created: function(){
			if(sessionStorage.userInfo!=''&&sessionStorage.userInfo!=null){
			}else{
				this.$router.push({
					name: 'Login'
				})				
			}
			this.getWS()
			if(sessionStorage.fourList&&sessionStorage.fourList!=''){
				this.getMess(JSON.parse(sessionStorage.fourList)[0])
				this.fourList=JSON.parse(sessionStorage.fourList)
			}
		},
		methods: {
			getIsShow(val){
				this.isShow=val
			},
			getWS(){
				var that=this
				this.$options.sockets.onmessage = (data) => this.getMess(data)
			},
			getMess(mess){
				var that=this
				if(mess.data!=''){
					if(sessionStorage.fourList&&sessionStorage.fourList!=''){
						var info = JSON.parse(sessionStorage.fourList)
						if(info.length>=10){
							sessionStorage.fourList=JSON.stringify(info.shift())
						}
						var myDate=new Date()
						var time=myDate.toLocaleTimeString()						
						info.push({data:mess.data,time:time})
						sessionStorage.fourList=JSON.stringify(info)
						that.isShow=true
						that.wslist=mess.data
						setTimeout(function(){
							that.isShow=false
						},5000)					
						that.fourList=JSON.parse(sessionStorage.fourList)
					}else{
						var myDate=new Date()
						var time=myDate.toLocaleTimeString()
						that.fourList.push({data:mess.data,time:time})
						that.isShow=true
						that.wslist=mess.data
						setTimeout(function(){
							that.isShow=false
						},5000)
						sessionStorage.fourList=JSON.stringify(that.fourList)
					}
				}
				console.log(mess.data)
			}		
		},
		components: {
			publicMenu,
			tip,
		}
	}

</script>
<style scoped>

</style>