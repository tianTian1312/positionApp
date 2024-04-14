<script>
	import permision from "@/js_sdk/wa-permission/permission.js";
	import dataUrl from '@/common/dataUri.js';
	var music = null;
	music = uni.getBackgroundAudioManager();
	music.src = "static/silent.mp3";
	music.autoplay = true;
	music.loop = true;
	var interval = null;
	
	export default {
		data() {
			return {
				form: {
					type: "wgs84",
					userName: "",
					deviceId: "",
					phonenumber: "",
					longitude: "",
					latitude: "",
					addInfo: ""
				},
			}
			
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			let systemType = uni.getSystemInfoSync().platform;
			// 安卓
			if (systemType === 'android') {
				var context = plus.android.importClass('android.content.Context');
				var locationManager = plus.android.importClass('android.location.LocationManager');
				var main = plus.android.runtimeMainActivity();
				var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
				if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
					uni.showModal({
					title: '提示',
					content: '请打开定位服务功能',
					showCancel: false,
					success() {
						if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
							var Intent = plus.android.importClass('android.content.Intent');
							var Settings = plus.android.importClass('android.provider.Settings');
							var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
							main.startActivity(intent); // 打开系统设置定位服务功能页面
						} else {
							console.log('定位服务功能已开启');
						}
					}
					});
				}
			} else if (systemType === 'ios') {
				if (!permision.judgeIosPermission("location")) {
					console.log('定位服务功能已开启');
				} else{
					// plus.runtime.launchApplication({
					// 	action: 'App-Prefs:root=LOCATION_SERVICES'
					// }, function(e) {
					// 	console.log(JSON.stringify(e));
					// })
				}
			}
			if (interval != null){
				clearInterval(interval);
				interval = null;
			}
		},
		onHide: function() {
			console.log('App Hide')
			this.form.userName = uni.getStorageSync('uni_map_user');
			this.form.phonenumber = uni.getStorageSync('uni_map_phone');
			const {deviceBrand, deviceModel, deviceId, osName, osVersion} = uni.getSystemInfoSync();
			this.form.deviceId = deviceId;
			
			let _this = this;
			if (interval != null){
				clearInterval(interval);
				interval = null;
			}
			
			interval = setInterval((res) =>{
				uni.getLocation({
					type: this.form.type,
					geocode: true,
					success: function (res) {
						console.log("经度："+ res.longitude);
						console.log("纬度："+ res.latitude);
						_this.form.longitude = res.longitude;
						_this.form.latitude = res.latitude;
						_this.form.addInfo = JSON.stringify(res.address);
						uni.request({
							url: dataUrl.uploadLocationUri,
							method: "POST",
							header: {
								"Content-Type": "application/json"
							},
							data: _this.form,
							success: (res) => {
								console.log(res.data);
							},
							fail: (res) => {
								console.log(res);
								// uni.showModal({
								// 	title: "提示",
								// 	content: res.errMsg,
								// 	showCancel: false,
								// })
							}
						})
					}
				})
			}, 1000*60)
		},
	}
</script>

<style>
	/*每个页面公共css */
	 /* @import './common/uni.css'; */
</style>
