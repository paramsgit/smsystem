import React, { useEffect, useState } from 'react'
import { countryCodes } from '../../utils/helper'
import ServiceModal from './serviceModal'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { OpenServiceModal } from '../../utils/appSlice'
import { getAuthToken } from '../../utils/isLoggedIn'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SystemUsage from './systemUsage'

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
interface systemDetails{
    free_ram: number, total_ram: number, cpu_usage: number
}
const socket = io('http://127.0.0.1:5000');

const ServicesTable = (props: Props) => {
    const dispatch=useDispatch()
    const [sessionData,setsessionData]=useState<sessionDetail[] | null>(null)
    const [combinedData,setcombinedData]=useState<sessionDetail[] | null>(null)
    const [systemDetails,setsystemDetails]=useState<systemDetails | null>(null)
    const [refresh,setrefresh]=useState(false)

    useEffect(() => {
        socket.on('server_message', (data: { status: string }) => {
          console.log('Connection status:', data);
        });
        socket.on('system_stats', (data:systemDetails) => {
          setsystemDetails(data)
        });
      
        return () => {
          socket.off('server_message');
        }
      }, [socket])

    useEffect(() => {
        const getAllSessions=async()=>{
            try {
                const response=await fetch(`http://localhost:5000/session`);
                const responsedata=await response.json();
                const extractedData=extractDetails(responsedata.sessions)
                setsessionData(extractedData)
            } catch (error) {
                
            }
           
        }
        getAllSessions()
     
    }, [refresh])
    
    useEffect(() => {
        const stoppedSessions=localStorage.getItem('stoppedSessions')
        let stoppedData;
        if(stoppedSessions){
            stoppedData=JSON.parse(stoppedSessions)
        }

        if(!stoppedData) { setcombinedData(sessionData);return};
        if(!sessionData) { setcombinedData(stoppedData);return;}
        const filteredStoppedData = stoppedData.filter(
            (stoppedItem:sessionDetail) =>
              !sessionData.some(
                activeItem =>
                  activeItem.countryname === stoppedItem.countryname &&
                  activeItem.operatorname === stoppedItem.operatorname
              )
          );
            localStorage.setItem('stoppedSessions',JSON.stringify(filteredStoppedData))
            const combinedData = [...sessionData, ...filteredStoppedData];
            const toDateTime = (date: string, time: string): Date => new Date(`${date} ${time}`);
            combinedData.sort((a, b) => toDateTime(a.date, a.time).getTime() - toDateTime(b.date, b.time).getTime());


            setcombinedData(combinedData)

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

    const handleRestart=async(session:sessionDetail)=>{
        // setdisabledBtn(true);
        const selectedProgram=session.programName;
        const selectedOperator=session.operatorname;
        const selectedCountryValue=(session.countryname).toLowerCase();

        if(!selectedProgram || !selectedOperator || !selectedCountryValue){
            toast.error("Some details missing, Can't restart")
            return;
        }
        const authToken=getAuthToken();
        if(!authToken){
            toast.error("Session Expired, Login Again")
        return;

        }

        const reqData=JSON.stringify({ country:selectedCountryValue,operator:selectedOperator,program:selectedProgram })
        console.log(reqData)
        try {
            const response=await fetch("http://localhost:5000/session/start",{
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`bearer ${authToken}`
                  },
                body: reqData,
            })

            const result=await response.json();
            if(response.ok && result.response){
                toast.success(`Restarted, ${result?.message}`)
                setrefresh(!(refresh))   
            }else{
                toast.error(result?.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(`${error}`)
        }
    }

  return (
    <div>
    <section className="container px-4 mx-auto">
    <div className="flex items-center justify-between mb-8">

        <div>
            <div className="flex flex-col sm:flex-row items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Sessions</h2>

                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{sessionData?.length} Active</span>
            </div>

            <p className="mt-1 hidden sm:block text-sm text-gray-500 dark:text-gray-300">
             
            Click Add button to start a new session
            </p>
        </div>
        {systemDetails && <SystemUsage data={systemDetails}/>}
      
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
            <button className="disabled cursor-not-allowed flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">

                <span>🛑 Stop All</span>
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
                                    </button>
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Actions</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 ">
                            
                        
                           

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
                                    <div className=" inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                                    <h2 className="text-sm font-normal text-emerald-500">Active</h2>
                                </div>
                                    :   
                                    <div className="StatusDiv inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-100/60 dark:bg-gray-800">

                                        <h2 className="text-sm font-normal text-yellow-500">Stopped</h2>
                                    </div>
                                    }
                                    
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                <div className="flex items-center gap-x-2">
                                    <button type="button" onClick={()=>{handleRestart(s)}}  className={`px-3 py-2 text-xs rounded-full font-medium text-center inline-flex items-center text-white bg-gray-700 hover:bg-gray-800 focus:outline-none  dark:bg-gray-600 dark:hover:bg-gray-700 ${s.status==="Active" && "disabled"}`}>
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
                   {!combinedData && <div className='w-full px-4 py-3 flex justify-center'>
                        No items found
                    </div>}
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