import displayMsg from "./authorization.js";
document.querySelector(".form").addEventListener("submit",(e)=>{
    e.preventDefault();

    let name = document.querySelector(".name").value;
    let email = document.querySelector(".email").value
    let password = document.querySelector(".password").value
    let ConfirmPassword = document.querySelector(".confpassword").value
    // if(!name || !password || !Email)
    console.log(name,password,email,ConfirmPassword)

    if(password !== ConfirmPassword){
        displayMsg("Passowrd Dose Not match")
        return
    }
})
