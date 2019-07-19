<template>
	<div
		class="ghost-button-wrapper"
		v-on="buttonListeners"
		:class="{
			'is-disabled': disabled
		}">
		<div class="top-line"></div>
		<span class="content">
			<slot>button</slot>
		</span>
		<div class="bottom-line"></div>
	</div>
</template>

<script>
	export default {
		name: 'GhostButton',
		inheritAttrs: false,
		props: {
			disabled: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			buttonListeners(){
				const vm = this;
				return Object.assign({},
					this.$listeners,
					{
						click(event){
							if(vm.disabled){
								return
							}
							vm.$emit('click')
						}
					})
			}
		}
	}
</script>

<style lang="less" scoped>
	@color: #0576DB;
	.ghost-button-wrapper{
		position: relative;
		display: inline-block;
		width: 90px;
		height: 30px;
		line-height: 30px;
		color: #fff;
		background: @color;
		text-align: center;
		cursor: pointer;
		font-size: 12px;
		.content{

		}
		.top-line, .bottom-line{
			position: absolute;
			display: inline-block;
			width: 0;
			height: 5px;
			background: @color;
		}
		.top-line{
			right: 0;
			top: 0;
		}
		.bottom-line{
			left: 0;
			bottom: 0;
		}
		&:hover{
			background: #fff;
			color: @color;
			.top-line, .bottom-line{
				width: 100%;
				transition: all .3s ease;
			}
		}
		&.is-disabled{
			cursor: not-allowed;
			&:hover{
				background: #a0cfff;
				color: #fff;
				.top-line, .bottom-line{
					width: 0;
				}
			}
		}
	}
</style>