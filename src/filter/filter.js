import accounting from 'accounting'

const filters = {
	currency(value){
		return accounting.formatMoney(value, '')
	},
	Number(value){
		return accounting.formatNumber(value, '')
	},
	//格式化时间
	formatDate(value){
		return new Date(value).Format('yyyy-MM-dd hh:mm:ss')
	},
	//"+、-"转换为"上浮、下浮"
	signToWords(value){
		let result = value.toString();
		let sign = result.charAt(0);
		if(sign == '+'){
			return '上浮 ' + result.slice(1)
		}else if(sign == '-'){
			return '下浮 ' + result.slice(1)
		}else{
			return '上浮 ' + result
		}
	}
}

export default filters