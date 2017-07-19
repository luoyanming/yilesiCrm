<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	font-family: "Noto Sans CJK SC","Source Han Sans CN",'Hiragino Sans GB','Microsoft YaHei','\5b8b\4f53',sans-serif !important;
	font-size: 12px;
	-webkit-font-smoothing: antialiased;
}

.el-input-group__prepend{
    background : #ddd !important;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	overflow: hidden;
}

.el-menu-item{
	display: block;
	position: relative;
	padding-left:30px !important;
	height: 40px !important;
	font-size: 12px !important;
	line-height: 40px !important;
	background-color: #1f2e54 !important;
	background-repeat: no-repeat;
	background-position: 26px center;
	background-size: 16px 16px;
	&.is-active, &:hover {
		background-repeat: no-repeat;
		background-position: 26px center;
		background-size: 16px 16px;
		color: #28aaf8 !important;
		background-color: #121f3e !important;
	}
}
.el-submenu__title{
	display: block;
	padding-left: 30px !important;;
	height: 40px !important;
	font-size: 12px !important;
	line-height: 40px !important;
	color: #788ab7 !important;
	&:hover{
		 background-color: #121f3e !important;
	 }
	i{
		color: #fff !important;
	}
}

.el-upload{
	display: inline-block;
}
.el-upload-list__item-name{
	font-size: 12px !important;
}
</style>