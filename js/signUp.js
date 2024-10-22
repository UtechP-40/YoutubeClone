// import displayMsg from "./authorization.js";

class OTPGenerator {
    constructor() {
      this.queue = [];
      this.otpSet = new Set(); 
      this.expiryTime = 600000; 
    }
  
   
    generateRandomOTP() {
      return Math.floor(100000 + Math.random() * 900000).toString(); 
    }
  
       generateOTP() {
      let otp;
  
      do {
        otp = this.generateRandomOTP();
      } while (this.otpSet.has(otp));
  
      this.otpSet.add(otp);
      this.queue.push({ otp, createdAt: Date.now() });
  
      setTimeout(() => this.removeOTP(otp), this.expiryTime);
  
      return otp;
    }
  
     removeOTP(otp) {
      this.otpSet.delete(otp);
      this.queue = this.queue.filter(item => item.otp !== otp);
      console.log(`OTP ${otp} expired and removed`);
    }
  
    displayQueue() {
      console.log('Current OTP Queue:', this.queue);
    }
  }

document.querySelector(".form").addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log(e)
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
    const otpGenerator = new OTPGenerator();
    const otp1 = otpGenerator.generateOTP();
    otpGenerator.displayQueue();
   //html data returned from retHtml function
    let returnedHtml = retHtml(name,email,otp1)
    let test1 = `Please confirm That you are ${signupDetails.name}`;
    //mail info
    let mail = {
        to: signupDetails.email,
        subject: "Confermation Mail",
        text: test1,
        html: returnedHtml,
    }
    

    //fetch for send mail api
     fetch("http://localhost:3000/send-email",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(mail),

    }).then((data)=>{
        console.log(data)
        return data
    }).then((responce)=>{
        // console.log()
        if(!responce.ok){
            throw new Error("Somthing Went wrong 😑")
        }
        


    }).then((data1)=>{
        fetch("https://instagram-express-app.vercel.app/api/auth/signup",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password 
            })
        }).then((res)=>{
            // console.log("1")
            return res.json()
    
        }).then((output)=>{
            if(!output.success){
                displayMsg(output.message)
                return
            }


            let oneTimePass = document.createElement("div")
        oneTimePass.innerHTML = `<form class="otp">
        <input type="password" required class="otpp" name="otp" placeholder="ENTER OTP" />
          <button class="verify" type="submit">Verify</button></form>`
        //   oneTimePass.style.display="flex"
        let element = document.querySelector(".login")
        element.after(oneTimePass);
        element.style.display = "none"
        let count = 0;
        return new Promise((resolve, reject) => {
        document.querySelector(".otp").addEventListener("submit", (e) => {
            e.preventDefault();
            count++;
            let otpBox = document.querySelector(".otpp").value;

            if (otpBox !== otp1 && count < 10) {
                displayMsg(`Wrong OTP. You have ${10 - count} attempts left.`);
                return;
            } else if (otpBox === otp1) {
               
                resolve(output);
            } else if (count == 10) {
                displayMsg("Maximum attempts reached.");
                element.style.display = "block";
                oneTimePass.remove();
                reject(new Error("Max OTP attempts reached"));
            }
        });
    });
})
        .then((output2)=>{
            // console.log("2")
            if(!output2.success){
                displayMsg(output2.message)
                return
            }
            localStorage.setItem("token",output2.data.token);
            let token = localStorage.getItem("token")
            if(!token)return;
            // authorization("",token)
            // console.log("3")
            window.location.href = "../index.html"
        })
    }).catch(err=>console.log(err))
    // callMe()

})

// //call me function is for calling the signUP api and it requires nothing as a parameter
// function callMe(){
//     return 
// }

function displayMsg(msg){
    document.querySelector(".message").innerText=msg
    setTimeout(()=>{
        document.querySelector(".message").innerText=""
    },10000)
};




  
 
  
  

  





//retHtml is a function which returns a html for mailing purpose and it requires name email and OTP
function retHtml(name,email,otp){
    return `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OTP Email Template</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

  <link rel="stylesheet" href="/style.css">
  <style>body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  padding: 0;
  margin: 0;
}
.container-sec {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}
.otp-code {
  font-size: 24px;
  font-weight: bold;
  background-color: #f8f9fa;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  border: 1px dashed #007bff;
  color: #007bff;
}
.btn-verify {
  display: inline-block;
  padding: 10px 20px;
  color: #ffffff;
  background-color: #007bff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
}
.footer-text {
  color: #6c757d;
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
}
.footer-text a {
  color: #007bff;
  text-decoration: none;
}
.otp-lock {
  color: #333;
  font-size: 80px;
}
.welcome-section {
  background: #144fa9db;
  padding: 30px;
  border-radius: 4px;
  color: #fff;
  font-size: 20px;
  margin: 20px 0px;
}
.welcome-text {
  font-family: monospace;
}
.app-name {
  font-size: 30px;
  font-weight: 800;
  margin: 7px 0px;
}
.verify-text {
  margin-top: 25px;
  font-size: 25px;
  letter-spacing: 3px;
}
i.fas.fa-envelope-open {
  font-size: 35px !important;
  color: #ffffff;
}
</style>
</head>

<body>
  <div class="container-sec">
    <div class="text-center">
      <div><i class="fas fa-lock otp-lock"></i></div>
      <div class="welcome-section">
        <div class="app-name">
          --- Youtube ---
        </div>
        <div class="welcome-text">
          Thanks for signing up !
        </div>

        <div class="verify-text">
          Please Verify Your Email Address
        </div>
        <div class="email-icon">
          <i class="fas fa-envelope-open"></i>
        </div>

      </div>
      <h2>Hello, ${name}</h2>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <div class="otp-code">${otp}</div>
      <p class="mt-4">Please use this OTP to complete your verification. The OTP is valid for the next 10 minutes.</p>
      <a href="#" class="btn-verify">Verify Now</a>
    </div>
    <div class="footer-text">
      <p>If you did not request this OTP, please <a href="#">contact us</a> immediately.</p>
      <p>Thank you,<br>The Youtube Team</p>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>

</html>`

}