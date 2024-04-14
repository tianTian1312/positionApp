<template>
	<view class="example">
		<uni-forms ref="baseForm" :model="form" labelWidth="80px">
			<uni-forms-item label="姓名" required>
				<uni-easyinput v-model="form.name" :disabled=!editStatus placeholder="请输入姓名" />
			</uni-forms-item>
			
			<uni-forms-item label="手机号码" required>
				<uni-easyinput v-model="form.phone" :disabled=!editStatus type="number" maxlength="11" placeholder="请输入手机号码" />
			</uni-forms-item>
		</uni-forms>
		
		<view class="row" style="margin-top: 50rpx; margin-left: 40%;">
			<button v-if=!editStatus type="info" size="mini" @click="editStatus = true">编辑</button>
			<button v-if=editStatus type="warn" size="mini" @click="save()">保存</button>
		</view>
		
		
		<view>
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				editStatus: false,
				form: {
					name: "",
					phone: ""
				},
				msgType: "",
				messageText: ""
			}
		},
		onShow() {
			this.checkCache();
		},
		methods: {
			checkCache(){
				this.form.name = uni.getStorageSync('uni_map_user');
				this.form.phone = uni.getStorageSync('uni_map_phone');
				if (!this.form.name || !this.form.phone) {
					this.editStatus = true;
				}
			},
			
			save() {
				if (!this.form.name || !this.form.phone) {
					this.msgType = "error";
					this.messageText = `保存时姓名和手机号码不能为空！`;
					this.$refs.message.open();
					return;
				}
				uni.setStorageSync('uni_map_user', this.form.name);
				uni.setStorageSync('uni_map_phone', this.form.phone)
				this.msgType = "success";
				this.messageText = `保存成功！`;
				this.$refs.message.open();
				this.editStatus = false;
			}
			
		}
	}
</script>

<style lang="scss">
	.example {
		padding: 15px;
		background-color: #fff;
	}
</style>