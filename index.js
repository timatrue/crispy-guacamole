/*module pattern to encapsulate all logic*/
this.MyForm = (function(){  
	let user, email, phone, myContainer, myForm, mySubmit, xhttp;

	function initListeners(form, div){
		user = form.querySelector('#username');
		user.addEventListener('input', userValidation, false);
		email = form.querySelector('#email');
		email.addEventListener('input', emailValidation, false);
		phone = form.querySelector('#phone');
		phone.addEventListener('input', phoneValidation, false);
		form.addEventListener('submit', submit, false);
		form.querySelectorAll('input:not([type=submit])').forEach(input => input.setCustomValidity(getError().defaultMsg));
		mySubmit = form.querySelector('[type=submit]');
		myContainer = div;
		myForm = form;
	}
	function userValidation(event){
		let userRegExp, valid, message, error; 

		userRegExp = /^[\S]+(\s)[\S]+(\s)[\S]+$/;
		error = getError().user;
		valid = userRegExp.test(event.target.value);
		message = valid ? '' : error;
		setInputAttr.call(this, valid, message);
		event.preventDefault();	
	}
	function emailValidation(event){
		let emailRegExp, valid, message, error; 

		emailRegExp = /@(yandex\.(ru|ua|by|kz|com)|ya.ru)$/;
		error = getError().email;
		valid = emailRegExp.test(event.target.value);
		message = valid ? '' : error;
		setInputAttr.call(this, valid, message);
		event.preventDefault();	
	}
	function phoneValidation(event){
		let phoneRegExp, valid, message, error; 
		
		phoneRegExp = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
		error = getError().phone;
		valid = phoneRegExp.test(event.target.value) && isSumValid(event);
		message = valid ? '' : error;
		setInputAttr.call(this, valid, message);
		event.preventDefault();	
	}
	function isSumValid(event){
		let sum = event.target.value.replace(/[^0-9.]/g, '').split('').map(elem => Number(elem)).reduce((a,b) => a + b);
		return sum < 30;
	}
	function setInputAttr(valid, message){
		if(!valid) this.classList.add("error");
		else this.classList.remove("error");
		this.setCustomValidity(message);	
	}
	function submit(event){
		if(myForm.checkValidity()){
			if(event) event.preventDefault();
			requestData.call(myForm);
			//myForm.reset();
		}		
	}
	function requestData(){
		let url, urlParam;
		
		urlParam = [...this.querySelectorAll('input:not([type=submit])')].map(input => input.name + '=' + input.value).join('&');
		url = this.action + "?" + encodeURIComponent(urlParam);
		xhttp = new XMLHttpRequest();
		xhttp.addEventListener("load", reqListener);
		xhttp.open("GET", url, true);
		xhttp.send();
		mySubmit.disabled = true;
	}
	function reqListener() {
		let result = eval(this.responseText);
		
		switch(result.status){
			case "success":
			myContainer.textContent = "Success";
			mySubmit.disabled = false;
			myContainer.classList = ["success"];
			break;
			case "error":
			myContainer.textContent = result.reason;
			myContainer.classList = ["error"];
			mySubmit.disabled = false;
			break;
			case "progress":
			myContainer.textContent = "Pending...";
			myContainer.classList = ["progress"];
			setTimeout(()=> requestData.call(myForm), result.timeout);
			break;
		}
		console.log(result);
	}
	function validate(){
		let errors = [...myForm.querySelectorAll('input:not([type=submit])')].filter(input => !input.checkValidity()).map(input => input.name);
		return { isValid: myForm.checkValidity(), errorFields: errors}
	}
	function getData(){
		let data = {}; 
		myForm.querySelectorAll('input:not([type=submit])').forEach(input => data[input.name] = input.value);
		return data;
	}
	function setData(data){
		myForm.querySelectorAll('input:not([type=submit])').forEach(input => input.value = data[input.name]);
	}
	function getError(){
		return {
			defaultMsg: "Please fill out this field",
			user: "Format: three words",
			email: "Format: email must contain . and @. Domain:  ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com",
			phone: "Format: +7(111)111-22-33. Sum of digits should be less or equal 30"
		}
	}
	return {
		initListeners : initListeners,
		submit : submit,
		validate : validate,
		getData : getData,
		setData : setData
	}
})();
this.MyForm.initListeners(this.myForm, this.resultContainer);