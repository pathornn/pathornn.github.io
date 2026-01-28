function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

// เรียกใช้งาน
loadComponent('header-placeholder', 'header.html');
loadComponent('nav-placeholder', 'navigation.html');

const test_var = document.querySelector("#test_var");

test_var.addEventListener("click", function() {
    var number = 4;
    var my_string = "say";
    var my_array = [10, 20, "name", true];

    for(var i=0; i<number; i++){
        alert(my_string + " " + my_array[i % my_array.length]);
    }
});

const ifelse = document.querySelector("#ifelse");

ifelse.addEventListener("click", function(){
    var input1 = document.querySelector("#num1").value;
    var input2 = document.querySelector("#num2").value;

    var val1 = parseInt(input1);
    var val2 = parseInt(input2);

    if (val1 < val2){
        alert("ถูกต้องแล้วนะคร้าบ")
    }else{
        alert("ไอโง่");
    }
});

const string_check = document.querySelector("#string_check");

string_check.addEventListener("click", function(){
    var input1 = document.querySelector("#string1").value;
    var input2 = document.querySelector("#string2").value;

    if(input1.length > 0 && input2.length > 0){
        var combine = input1 + input2;
        
        const join = document.querySelector("#join");
        join.innerHTML = "string = " + combine;

        const string_length = document.querySelector("#string_length");
        string_length.innerHTML = "length = " + combine.length;

        const string_upper = document.querySelector("#string_upper");
        string_upper.innerHTML = "toUpperCase = " + combine.toUpperCase();
    }

    
});

const emailInput = document.querySelector("#email");
const emailStatus = document.querySelector("#email_check");
const passInput = document.querySelector("#password");
const passStatus = document.querySelector("#password_check");

emailInput.addEventListener("input", function(){
    let emailRex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailRex.test(emailInput.value)){
        emailStatus.textContent = "ผ่านแล้ว!";
        emailStatus.style.color = "green";
    }else{
        emailStatus.textContent = "ยังไม่ผ่านนะ";
        emailStatus.style.color = "darkgray";
    }
});

passInput.addEventListener("input", function(){
    let passRex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
    if (passRex.test(passInput.value)){
        passStatus.textContent = "ผ่านแล้ว!";
        passStatus.style.color = "green";
    }else{
        passStatus.textContent = "ยังไม่ผ่านนะ";
        passStatus.style.color = "darkgray";
    }
});