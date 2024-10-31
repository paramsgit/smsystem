import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
type Props = {}

const Signup = (props: Props) => {
    const navigate=useNavigate()
    const [email,setemail]=useState("")
    const [name,setname]=useState("")
    const [password,setpassword]=useState("")
    const [cpassword,setcpassword]=useState("")
    const [showAlert,setshowAlert]=useState(false)
    const [alertStatus,setalertStatus]=useState(false)
    const [alertText,setalertText]=useState("")
    const handleSubmit=async(e:any)=>{
        e.preventDefault()
        if(!email || !password || !name) {setalertText("Check all empty fields");setalertStatus(false); setshowAlert(true);return;}
        if(password!==cpassword) {setalertText("Password don't match");setalertStatus(false); setshowAlert(true);return;}

        try {
            const response=await fetch("http://localhost:5000/users/",{
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json' 
                  },
                body: JSON.stringify({ email:email,password:password,name:name }),
            })

            const result=await response.json();
            if(response.ok && result.data){
                 setalertText("Success, Redirecting...");
                  setalertStatus(true); 
                  setshowAlert(true);
                localStorage.setItem('auth-token',JSON.stringify(result.data))
                setTimeout(() => {
                    navigate("/")
                }, 1000);
                
            }else{
                  setalertText(result?.message);
                  setalertStatus(false);
                  setshowAlert(true);          

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
      <p  className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
          QuickText    
      </p>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Smith"  
                      value={name} onChange={(e)=>{setname(e.target.value)}}/>
                  </div>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"  
                      value={email} onChange={(e)=>{setemail(e.target.value)}}/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={password} onChange={(e)=>{setpassword(e.target.value)}} />
                  </div>
                  <div>
                      <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={cpassword} onChange={(e)=>{setcpassword(e.target.value)}}/>
                  </div>
                  <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300 flex">I accept the <p className="font-medium text-primary-600 hover:underline dark:text-primary-500 mx-15
                        " >Terms and Conditions</p></label>
                      </div>
                  </div>
                  <div className={`${showAlert? "opacity-100 py-3":"opacity-0 h-0"} px-4  mb-4 text-sm
                  ${alertStatus?"text-green-800 bg-green-50 dark:text-green-400":"text-red-800 bg-red-50 dark:text-red-400"}  rounded-lg  dark:bg-gray-800  smooth`} role="alert">
                     {alertText}
                    </div>
                  <button onClick={(e)=>{handleSubmit(e)}} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <Link to={'/signin'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
    </>
  )
}

export default Signup