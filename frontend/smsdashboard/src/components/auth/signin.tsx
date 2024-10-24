import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Props = {}

const SignIn = (props: Props) => {
    const navigate=useNavigate()
    const [email,setemail]=useState("")
    const [password,setpassword]=useState("")
    const [showAlert,setshowAlert]=useState(false)
    const [alertStatus,setalertStatus]=useState(false)
    const [alertText,setalertText]=useState("")

    const handleSubmit=async(e:any)=>{
        e.preventDefault()
        if(!email || !password) {setalertText("Email and password can't be Empty");setalertStatus(false); setshowAlert(true);return;}

        try {
            const response=await fetch("http://localhost:5000/users/login",{
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json' 
                  },
                body: JSON.stringify({ email:email,password:password }),
            })

            const result=await response.json();
            if(response.ok && result.data){
                { setalertText("Success, Redirecting...");
                  setalertStatus(true); 
                  setshowAlert(true);}
                localStorage.setItem('auth-token',JSON.stringify(result.data))
                setTimeout(() => {
                    navigate("/")
                }, 1000);
                
            }else{
                { setalertText(result?.message);
                  setalertStatus(false);
                  setshowAlert(true);          }

            }
            console.log(result)
            console.log(response.ok)
        } catch (error) {
            console.log(error)
            setalertText("Something went wrong");
            setalertStatus(false); 
            setshowAlert(true)
        }
    }
  return (
   <>
   <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <p className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Flowbite    
      </p>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" method='post' action="#">
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" value={email} onChange={(e)=>{setemail(e.target.value)}} />
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <p className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</p>
                  </div>
                  <div className={`${showAlert? "opacity-100 py-3":"opacity-0 h-0"} px-4  mb-4 text-sm
                  ${alertStatus?"text-green-800 bg-green-50 dark:text-green-400":"text-red-800 bg-red-50 dark:text-red-400"}  rounded-lg  dark:bg-gray-800  smooth`} role="alert">
                     {alertText}
                    </div>
                  <button onClick={(e)=>{handleSubmit(e)}} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to={"/signup"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
   </>
  )
}

export default SignIn