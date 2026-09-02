//    p.innerHTML = "Starting DOM Projects"
   // const page = document.getElementsByTagName('p')[2]
   // console.log(page);
   // console.log(page.style.backgroundColor = "red");

   // const firstPage  = document.getElementById("one")
   // console.log(firstPage.innerHTML);

   // const div = document.getElementsByClassName('container')[0]
   // div.style.color = "blue";
   // div.style.backgroundColor = "green";

   // const heading = document.querySelector("h1");
   // // console.log(heading);
   // const headings = document.querySelectorAll('h1');
   // // console.log(headings[1]);
   // const container = document.querySelector(".container")
   // // console.log(container);
   // container.textContent += "ADD THIS CONTENT";
   // heading.innerText += ", STARTING DOM PROJECTS"
   // const emptyDiv = document.querySelector("#empty");
   // console.log(emptyDiv);
   // emptyDiv.innerHTML = "<Input placeholder='name'/>"
   // const btn = document.querySelector("button")
   // //attach and event listener (e.g click, submit)
   // btn.addEventListener('click', ()=>{
   //    //code to perform the action
   //    console.log("user clicked the button");
   //    heading .style.color = "red"; 
   //    container.className = 'error';
   // });
   
const form = document.querySelector('.form');
const username= document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#passwordTwo');

//add an event listener to the form to submit
form.addEventListener("submit", (event)=>{
   event.preventDefault();
   checkInputsSubmitted();
   // handleSubmit();
   // if(checkInputsSubmitted()){
   //    console.log("Form is valid, proceeding with submission");
   //    handleSubmit();
   // } else {
   //    console.log("form has errors");
      
   // }
});

// function handleSubmit() {
//    const usernameValue = username.value.trim()
//    const emailValue = email.value.trim();
//    const passwordValue = password.value;
//    const password2Value = confirmPassword.value;
//      alert("Account created successfully!");
//      form.reset();
// }
   
function checkInputsSubmitted (){
   const usernameValue = username.value.trim()
   const emailValue = email.value.trim();
   const passwordValue = password.value;
   const password2Value = confirmPassword.value;

   let isValid = true;

   if(usernameValue === "") {
      setError(username, "Username is required");
      isValid = false;
   }else if(usernameValue.length < 5){
      setError(username, "The minimum username length is 5");
      isValid = false;
   }else {
      setSuccess(username);
   }

   if (emailValue === "") {
      setError(email, "Email is required");
      isValid = false;
   } else if(!emailValue.includes("@")) {
      setError(email, "Enter a valid email address")
      isValid = false;
   } else{
      setSuccess(email)
   }

   if (passwordValue === "") {
      setError(password, "Password is required")
      isValid = false;
   } else if(passwordValue.length < 6){
      setError(password, "The minimum password length is 6")
      isValid = false;
   } else if(passwordValue === "password") {
      setError(password, 'The word "password" cannot be used')
      isValid = false;
   } else {
      setSuccess(password)
   }

   if (password2Value === "") {
      setError(confirmPassword, "Confirm Password is required");
      isValid = false;
   } else if (passwordValue !== password2Value) {
      setError(confirmPassword, "Password and Confirm Password must be equal")
      isValid = false;
   } else{
      setSuccess(confirmPassword)
   }
   // return isValid;

  if (isValid) {
    submitForm({ usernameValue, emailValue, passwordValue, password2Value  });

  }
   
}

function setError(input, errorMessage) {
   const formControl = input.parentElement;
   const small = formControl.querySelector('small');
   formControl.className = "form-control error";
   small.textContent = errorMessage;
}
function setSuccess(input) {
   const formControl = input.parentElement;
   formControl.className = "form-control success";  
}
function submitForm(data) {
  console.log('✅ All fields valid, submitting form...');
      alert("Account created successfully!");
     form.reset();
}
   
   


   
   
   
   
