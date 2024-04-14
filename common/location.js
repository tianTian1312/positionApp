import dataUrl from '@/common/dataUri.js'
	
export function getLocation(){
	var _this = this;
	uni.getLocation({
		type: this.form.type,
		geocode: true,
		success: function (res) {
			console.log("经度："+ res.longitude);
			console.log("纬度："+ res.latitude);
			_this.form.longitude = res.longitude;
			_this.form.latitude = res.latitude;
			_this.form.addInfo = JSON.stringify(res.address);
			_this.updateLocationData();
		}
	});
}
			
//上传位置信息
export function updateLocationData(){
	uni.request({
		url: dataUrl.uploadLocationUri,
		method: "POST",
		header: {
			"Content-Type": "application/json"
		},
		data: this.form,
		success: (res) => {
			console.log(res.data);
		},
		fail: (res) => {
			uni.showModal({
				title: "提示",
				content: res.errMsg,
				showCancel: false,
			})
		}
	})
}
