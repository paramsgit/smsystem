import React, { useEffect, useState } from 'react'
import { countryCodes } from '../../utils/helper'
import ServiceModal from './serviceModal'
import { useDispatch } from 'react-redux'
import { OpenServiceModal } from '../../utils/appSlice'
import { getAuthToken } from '../../utils/isLoggedIn'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {}
interface sessionDetail{
    id:string,
    programName:string,
    countryname:string,
    operatorname:string,
    date:string,
    time:string,
    sessionName:string,
    status:"Active"|"Stopped"
}
const ServicesTable = (props: Props) => {
    const dispatch=useDispatch()
    const [sessionData,setsessionData]=useState<sessionDetail[] | null>(null)
    const [combinedData,setcombinedData]=useState<sessionDetail[] | null>(null)
    const [refresh,setrefresh]=useState(false)

    useEffect(() => {
        const getAllSessions=async()=>{
            const response=await fetch(`http://localhost:5000/session`);
            const responsedata=await response.json();
            const extractedData=extractDetails(responsedata.sessions)
            console.log(typeof(extractedData))
            console.log(extractedData)
            setsessionData(extractedData)
        }
        getAllSessions()
     
    }, [refresh])
    
    useEffect(() => {
        const stoppedSessions=localStorage.getItem('stoppedSessions')
        let stoppedData;
        if(stoppedSessions){
            stoppedData=JSON.parse(stoppedSessions)
        }

        if(!stoppedData) return;
        if(!sessionData) {return;}
        const filteredStoppedData = stoppedData.filter(
            (stoppedItem:sessionDetail) =>
              !sessionData.some(
                activeItem =>
                  activeItem.countryname === stoppedItem.countryname &&
                  activeItem.operatorname === stoppedItem.operatorname
              )
          );
            const combinedData = [...sessionData, ...filteredStoppedData];
            const toDateTime = (date: string, time: string): Date => new Date(`${date} ${time}`);
            combinedData.sort((a, b) => toDateTime(a.date, a.time).getTime() - toDateTime(b.date, b.time).getTime());


            setcombinedData(combinedData)
            console.log(combinedData)

    }, [sessionData])
    
    const extractDetails = (response:string) => {
        const detailsArray:sessionDetail[] = [];
        const lines = response.split('\n');
      
        lines.forEach(line => {
            const match = line.match(/(\d+)\.(program\d*_\w+_\w+)\s+\((\d+\/\d+\/\d+)\s+(\d+:\d+:\d+\s+\w+)\)\s+\(Detached\)/);
          
            if (match) {
                const [_, id, sessionName, date, time] = match;
                const [programName, countryname, operatorname] = sessionName.split('_');
                detailsArray.push({
                  id,
                  programName,
                  countryname: countryname.toUpperCase(),
                  operatorname,
                  date,
                  time,
                  sessionName,
                  status:'Active'
                });
                if(_){}
              }
            });
          
            return detailsArray;
      }


      
      const handleStop=async(session:sessionDetail)=>{
        // setdisabledBtn(true);

        if(!session.sessionName){
            toast.error("Sorry, session name not found") ; 
                return;
        }
        const authToken=getAuthToken();
        if(!authToken){
            toast.error("Sorry, Login agin!!") ; 
        return;
        }


        // const reqData=JSON.stringify({"hello"})
        const reqData=JSON.stringify({ session_name:session.sessionName })

        try {
            const response=await fetch("http://localhost:5000/session/stop",{
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`bearer ${authToken}`
                  },
                body: reqData,
            })

            const result=await response.json();
            if(response.ok && result.response){
                 toast.success("Session Stopped Successfully")
                 const stoppedSessions=localStorage.getItem('stoppedSessions')
                    let stoppedData=[];
                    if(stoppedSessions){
                        stoppedData=JSON.parse(stoppedSessions)
                    }
                    session.status="Stopped"
                    stoppedData.push(session)
                    localStorage.setItem('stoppedSessions',JSON.stringify(stoppedData))
                    setrefresh(!refresh)
               
            }else{
               toast.error(result.message)       
                 
            }

        } catch (error) {
            console.log(error)
           
        }
    }

  return (
    <div>
         <section className="container px-4 mx-auto">
    <div className="sm:flex sm:items-center sm:justify-between">
        <div>
            <div className="flex items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Customers</h2>

                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">240 vendors</span>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">These companies have purchased in the last 12 months.</p>
        </div>

      
    </div>

    <div className="mt-6 flex flex-col-reverse items-start tablet:items-center  tablet:justify-between tablet:flex-row ">
        <div className="my-2 inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
            <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                All
            </button>

            <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                Active
            </button>

            <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                Stopped
            </button>
        </div>

        <div className='w-full flex justify-center tablet:w-auto tablet:p-0 tablet:m-0 p-4 mt-2 mb-10 bg-slate-50 tablet:bg-transparent rounded-xl'>
        <div className="my-2 w-full justify-center md:w-auto flex items-center  gap-x-3">
            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_3098_154395)">
                    <path d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_3098_154395">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>

                <span>Import</span>
            </button>

            <button onClick={()=>dispatch(OpenServiceModal())} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <span>Add</span>
            </button>
        </div>
        </div>
       
    </div>

    <div className="flex flex-col mt-4 md:mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden max-h-[600px] overflow-y-auto border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="py-3.5 px-4  text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-x-3">
                                       
                                        <span>Country</span>
                                    </div>
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <button className="flex items-center gap-x-2">
                                        <span>Operator</span>

                                       
                                    </button>
                                </th>

                                <th scope="col" className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <button className="flex items-center gap-x-2">
                                        <span>Status</span>

                                        <svg className="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                                            <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                                            <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                                        </svg>
                                    </button>
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Actions</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 ">
                            
                            <tr>
                                <td className="px-8  py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    <div className="inline-flex items-center gap-x-3">
                                       

                                        <div className="flex items-center gap-x-2">
                                            <img className="object-cover w-10 h-10 rounded-md" src="https://flagsapi.com/IN/flat/64.png" alt="" />
                                            <div>
                                                <h2 className="font-medium text-gray-800 dark:text-white ">India</h2>
                                                <p className="text-xs font-normal text-gray-500 dark:text-gray-400">@authurmelo</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                  <div className="flex justify-center md:justify-start">Jio</div>
                                </td>
                                <td className="px-8 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                                        <h2 className="text-sm font-normal text-emerald-500">Active</h2>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                    <button type="button" className="px-3 py-2 text-xs rounded-full font-medium text-center inline-flex items-center text-white bg-gray-700 hover:bg-gray-800 focus:outline-none  dark:bg-gray-600 dark:hover:bg-gray-700 ">
                                    Restart
                                    </button>
                                    <button type="button" className="px-3 py-2 text-xs rounded-full font-medium text-center inline-flex items-center text-white bg-red-700 hover:bg-red-800  focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 active:scale-[0.9] smooth">
                                    Stop
                                    </button>

                                    </div>
                                </td>
                               
                            </tr>
                           

                            {
                              combinedData?.map((s:sessionDetail)=>{
                                
                                return  <tr key={s.id}>
                                <td className="px-8  py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    <div className="inline-flex items-center gap-x-3">
                                       

                                        <div className="flex items-center gap-x-2">
                                            <img className="object-cover w-10 h-10 rounded-md" src={`https://flagsapi.com/${countryCodes[(s.countryname).toLowerCase()]}/flat/64.png`} alt="" />
                                            <div>
                                                <h2 className="font-medium text-gray-800 dark:text-white ">{s.countryname}</h2>
                                                <p className="text-xs font-normal text-gray-500 dark:text-gray-400">{s.sessionName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                  <div className="flex justify-center md:justify-start">{s.operatorname}</div>
                                </td>
                                <td className="px-8 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    {s.status==="Active"?  
                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                                    <h2 className="text-sm font-normal text-emerald-500">Active</h2>
                                </div>
                                    :   
                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-100/60 dark:bg-gray-800">

                                        <h2 className="text-sm font-normal text-yellow-500">Stopped</h2>
                                    </div>
                                    }
                                    
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                <div className="flex items-center gap-x-2">
                                    <button type="button" className={`px-3 py-2 text-xs rounded-full font-medium text-center inline-flex items-center text-white bg-gray-700 hover:bg-gray-800 focus:outline-none  dark:bg-gray-600 dark:hover:bg-gray-700 ${s.status==="Active" && "disabled"}`}>
                                    Restart
                                    </button>
                                    <button type="button" onClick={()=>{handleStop(s)}} className={`px-3 py-2 text-xs rounded-full font-medium text-center inline-flex items-center text-white bg-red-700 hover:bg-red-800  focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 active:scale-[0.9] smooth ${s.status!=="Active" && "disabled"}`}>
                                    Stop
                                    </button>

                                    </div>
                                </td>
                               
                            </tr>
                              })  
                            }
                           
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
{/* 
    <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
        <div className="text-sm text-gray-500 dark:text-gray-400">
            Page <span className="font-medium text-gray-700 dark:text-gray-100">1 of 10</span> 
        </div>

        <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
            <a href="#" className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>

                <span>
                    previous
                </span>
            </a>

            <a href="#" className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                <span>
                    Next
                </span>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </a>
        </div>
    </div> */}
    <ToastContainer
position="bottom-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"

/>
</section>

<ServiceModal refresh={refresh} setRefresh={setrefresh}/>
    </div>
  )
}

export default ServicesTable