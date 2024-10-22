// localStorage.setItem("token","0f901c2d-92a2-4c23-a11a-95efe44672d2")

let token;

// console.log(token)
token = localStorage.getItem("token")

if(token){
    authorization()
}else{
document.querySelector(".login").addEventListener("submit",(e)=>{
e.preventDefault();
let email = document.querySelector(".email").value
let password =  document.querySelector(".password").value
if(password.length<6){
    displayMsg("Password length must be more then 6")
    return
}
let loginData={
    email,
    password
}
let myHeader = new Headers();
myHeader.append("Content-Type",`application/json`)
fetch("https://instagram-express-app.vercel.app/api/auth/login",{
    method:"POST",
    headers: {
        "Content-Type": "application/json"
      },
    body:JSON.stringify(loginData)
}
)
.then((res)=>{
return res.json()
})
.then((output)=>{
    console.log(output)
    if(!output.success){
        throw new Error(output.message) 
    }
    if(output.data.token){
       token = output.data.token;
        localStorage.setItem("token",token)
        if(localStorage.getItem("token")){
            authorization(token)
        }
    }

}).catch((rej)=>{
    console.log(rej)
    displayMsg("Either Email or Password is Invalid")
})
// console.log(email_box.value,password_box.value)
})

}

function authorization(){
    let url = "https://instagram-express-app.vercel.app/api/auth/zuku"
let myHeader = new Headers();
     
     if(!token)return;
    myHeader.append("Authorization",`Bearer ${token}`)
 fetch(url,{
        method:"GET",
        headers: myHeader
    })
    .then((res)=>{
        // console.log(res)
        return res.json()
    }).then(data=>{
        console.log(data)
        if(data.success){
            location.href = "./pages/home.html"
        }
    })
    .catch((rej)=>{
        console.log(rej)
        
    })
}

function displayMsg(msg){
    document.querySelector(".message").innerText=msg
    setTimeout(()=>{
        document.querySelector(".message").innerText=""
    },10000)
};

// export default displayMsg;