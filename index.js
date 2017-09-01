'use strict';

const MyForm = {
	
	validate: () => {

		const formData = MyForm.getData();
		const fio = formData.fio;
		const email = formData.email;
		const phone = formData.phone;

		let errorFields = [];

		if (fio.split(/\s/).length != 3)
			errorFields.push('fio');

		
		if (!/^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/.test(email)) {	
			errorFields.push('email');
		} else {
			let pushIt = true;
			const domains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
			for (let i = 0; i < domains.length; i++) {
				if (email.substr( -1 * domains[i].length) === domains[i]) {
					pushIt = false;
					break;
				}
			}
			if (pushIt)
				errorFields.push('email');
		}

		let pushIt = false;
		if (phone.substr(0,2) != '+7')
			pushIt = true;
		if (!/\+{1}7{1}\({1}[0-9]{3}\){1}[0-9]{3}\-{1}[0-9]{2}\-{1}[0-9]{2}/.test(phone))
			pushIt = true;
		let sum = 0;
		for (let i = 0; i < phone.length; i++) {
			if (/[0-9]{1}/.test(phone[i]))
				sum += 1 * phone[i];
		}
		if (sum > 30)
			pushIt = true;

		if(pushIt)
			errorFields.push('phone');

		return {isValid: errorFields.length === 0, errorFields: errorFields};
	},
	getData: () => {

		const inputs = $('input');
		let data = {};
		for (let i = 0; i < inputs.length; i++)
			data[inputs[i].name] = inputs[i].value;
		return data;

	},
	setData: data => {

		const inputs = $('input');
		for (let i = 0; i < inputs.length; i++)
			inputs[i].value = data[inputs[i].name];

	},
	submit: () => {

		const validation = MyForm.validate();
		if (validation.isValid) {

			const inputs = $('input');
			inputs.css('border', '1px solid rgba(0,0,0,0)');

			$.ajax({
				url: $('form').attr('action'),
				data: MyForm.getData(),
				method: 'POST',
				success: result => {
					switch (result.status) {
						case 'success':
							$('div').attr('class', 'success');
							$('div').html('Success');
							break;
						case 'error': 
							$('div').attr('class', 'error');
							$('div').html(result.reason);
							break;
						case 'progress':
							$('div').attr('class', 'progress');
							$('div').html('');
							setTimeout(MyForm.submit, result.timeout);
							break;
					}
					const responses = ['success', 'error', 'progress'];
					$('form').attr('action', 'response/' + responses[Math.round(2 * Math.random())] + '.json');
				},
				error: err => {
					$('div').html('Data load error');
					$('div').attr('class', 'error');
				}
			});
		
		} else {
			const inputs = $('input');
			inputs.css('border', '1px solid rgba(0,0,0,0)');
			for (let i = 0; i < inputs.length; i++) {
				if (validation.errorFields.indexOf(inputs[i].name) != -1)
					$(inputs[i]).css('border', '1px solid red');
			}
		}

	}
}

$('form').on('submit', () => {
	MyForm.submit();
	return false;
});