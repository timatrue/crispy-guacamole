/*Randomly return one of 3 files in order to simulate the behavior of server*/
(function server(){
	let success, error, progress, random;
	
	success = {"status":"success"};
	error = {"status":"error","reason":"Cool Error"};
	progress = {"status":"progress","timeout":2000};
	random = Math.random()*10 <= 3 ? error : Math.random()*10 <= 4 ? progress : success;
	return random; 
})()