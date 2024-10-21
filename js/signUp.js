import {displayMsg,authorization} from "./authorization.js";
document.querySelector(".form").addEventListener("submit",(e)=>{
    e.preventDefault();

    let name = document.querySelector(".name").value;
    let email = document.querySelector(".email").value
    let password = document.querySelector(".password").value
    let ConfirmPassword = document.querySelector(".confpassword").value
    // if(!name || !password || !Email)
    console.log(name,password,email,ConfirmPassword)
    let signupDetails = {
        name,
        email,
        password
    }
    if(password !== ConfirmPassword){
        displayMsg("Passowrd Dose Not match")
        return
    }
    fetch("https://instagram-express-app.vercel.app/api/auth/signup",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(signupDetails)
    }).then((res)=>{
        return res.json()

    }).then((output)=>{
        console.log
        if(!output.success){
            displayMsg(output.message)
            return
        }
        localStorage.setItem("token",output.token);
        let token = localStorage.getItem("token")
        if(!token)return;
        // authorization("",token)
        window.location.href = "../index.html"
    })
})
