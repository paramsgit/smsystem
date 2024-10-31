import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../utils/store'
import { ClosePriorityModal } from '../../utils/appSlice'
import { countries,operators, priority } from '../../utils/helper'
import { Dropdown } from '../../utils/dropdown'
import { getAuthToken } from '../../utils/isLoggedIn'
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify'



type Props = {
    state:string,
    id?:number
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;

}
interface Option {
    value: string;
    label: string;
  }
 
const PriorityModal:React.FC<Props> = (props) => {
    const dispatch=useDispatch()
    const refresh=props.refresh
    const setRefresh=props.setRefresh
    const isModalOpen=useSelector((store:RootState)=>store.app.isPrioritysModalOpen)
    const [selectedCountryValue,setselectedCountryValue]=useState("")
    const [selectedCountry,setselectedCountry]=useState<Option | null>(null)
    const [selectedOperator,setselectedOperator]=useState<Option | null>(null)
    const [selectedProgram,setselectedProgram]=useState<Option | null>(null)
    const [disabledBtn,setdisabledBtn]=useState(false)
    const [showAlert,setshowAlert]=useState(false)
    const [alertStatus,setalertStatus]=useState(false)
    const [alertText,setalertText]=useState("")

    useEffect(() => {
        if(selectedCountry?.value)
    setselectedCountryValue(selectedCountry?.value) 
        setdisabledBtn(false)
    }, [selectedCountry])
    
    

    const handleSubmit=async(e:any)=>{

        setdisabledBtn(true);
        setalertText("Wait...")
        if(!selectedProgram || !selectedOperator || !selectedCountryValue){
            setalertText("Select all the fields");setalertStatus(false); setshowAlert(true);            setdisabledBtn(false);
            return;
        }



        const authToken=getAuthToken();
        if(!authToken){setalertText(`Error, Login again!!
        `);setalertStatus(false); setshowAlert(true);setdisabledBtn(false);
        return;

        }

        const reqData=JSON.stringify({ country:selectedCountryValue,operator:selectedOperator.value,is_high_priority:Boolean(Number(selectedProgram.value)) })
        console.log(reqData)
        try {
            const response=await fetch("http://localhost:5000/api/operators/pairs",{
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`bearer ${authToken}`
                  },
                body: reqData,
            })

            const result=await response.json();
            console.log(result)
            if(response.ok){

                 setalertText(result?.message);
                  setalertStatus(true); 
                  setshowAlert(true);
                //   props.setRefresh(!(props.refresh))
                setdisabledBtn(false)        
                setRefresh(!refresh)
            }else{
                 setalertText(result?.message);
                  setalertStatus(false);
                  setshowAlert(true); 
                  setdisabledBtn(false)        
                 
            }

        } catch (error) {
            console.log(error)
            setalertText("Something went wrong");
            setalertStatus(false); 
            setshowAlert(true);
            setdisabledBtn(false);
        }
        
    }
    const handleUpdate=async(e:any)=>{

        setdisabledBtn(true);
        setalertText("Wait...")
        if(!props.id){
            setalertText("Error in fetching ID");setalertStatus(false); setshowAlert(true);setdisabledBtn(false);
            return;
        }
        if(!selectedProgram){
            setalertText("Select required fields");setalertStatus(false); setshowAlert(true);setdisabledBtn(false);
            return;
        }



        const authToken=getAuthToken();
        if(!authToken){setalertText(`Error, Login again!!
        `);setalertStatus(false); setshowAlert(true);setdisabledBtn(false);
        return;

        }

        const reqData=JSON.stringify({is_high_priority:Boolean(Number(selectedProgram.value)) })
        console.log(reqData,selectedProgram)
        try {
            const response=await fetch(`http://localhost:5000/api/operators/pairs/${props.id}`,{
                method: "PUT",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`bearer ${authToken}`
                  },
                  body:reqData
            })

            const result=await response.json();
            console.log(result)
            if(response.ok){

                 setalertText(result?.message);
                  setalertStatus(true); 
                  setshowAlert(true);
                //   props.setRefresh(!(props.refresh))
                setdisabledBtn(false)        
                setRefresh(!refresh)
            }else{
                 setalertText(result?.message);
                  setalertStatus(false);
                  setshowAlert(true); 
                  setdisabledBtn(false)        
                 
            }

        } catch (error) {
            console.log(error)
            setalertText("Something went wrong");
            setalertStatus(false); 
            setshowAlert(true);
            setdisabledBtn(false);
        }
        
    }
    const handleDelete=async(e:any)=>{

        setdisabledBtn(true);
        
        if(!props.id){
            toast.error("Error in fetching ID")
            return;
        }

        const authToken=getAuthToken();
        if(!authToken){
            toast.error("Authentication failed, Login Again")
        return;

        }

        
        try {
            const response=await fetch(`http://localhost:5000/api/operators/pairs/${props.id}`,{
                method: "DELETE",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`bearer ${authToken}`
                  },
            })

            const result=await response.json();
            console.log(result)
            if(response.ok){
                toast.success(result?.message) 
                dispatch(ClosePriorityModal())
                setRefresh(!refresh)
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
        <div className="relative flex justify-center">
    {/* <button className="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
        Open Modal
    </button> */}

    <div
        
        className={`fixed ${isModalOpen?"":"hidden"} flex justify-center items-center inset-0 z-10 overflow-y-auto bg-black/70`} 
        
    >
       { props.state=="delete" &&
       <div className="relative p-4 w-full max-w-md max-h-full">
       <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
           <button type="button" onClick={()=>dispatch(ClosePriorityModal())} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
               <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                   <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
               </svg>
               <span className="sr-only">Close modal</span>
           </button>
           <div className="p-4 md:p-5 text-center">
               <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                   <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
               </svg>
               <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
               <button onClick={(e)=>{handleDelete(e)}} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                   Yes, I'm sure
               </button>
               <button onClick={()=>{dispatch(ClosePriorityModal());console.log("first")}} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
           </div>
       </div>
   </div>}

       { props.state=="add" && <div className="flex items-end justify-center min-h-screen px-4 pt-4  text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block px-4 pt-5 pb-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                    <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                        Priority Pairs
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Select country and operator with required priority.
                    </p>
                    <hr className='mt-2 mb-4'/>
                    <form className="mt-4" action="#">
                        <div className='flex flex-wrap w-full justify-evenly'>
                        <div className='w-1/2 p-2'>
                        <p className='text-sm mb-2 text-gray-800'>Country</p>
                        <Dropdown options={countries} setValue={setselectedCountry}/>
                        </div>
                        <div className={`${!selectedCountryValue && "disabled"} w-1/2 p-2`}>
                        <p className='text-sm mb-2 text-gray-800'>Operator</p>
                        
                        <Dropdown options={operators[selectedCountryValue]} setValue={setselectedOperator}/>
                        </div>
                        </div>

                        <div className='mb-4 p-2'>
                        <p className='text-sm mb-2 text-gray-800'>High Priority?</p>
                        <Dropdown options={priority} setValue={setselectedProgram}/>
                        </div>

                        <div className={`${showAlert? "opacity-100 py-3":"opacity-0 h-0"} px-4  mb-4 text-sm
                  ${alertStatus?"text-green-800 bg-green-50 dark:text-green-400":"text-red-800 bg-red-50 dark:text-red-400"}  rounded-lg  dark:bg-gray-800  smooth`} role="alert">
                     {alertText}
                    </div>

                        <div className="mt-2 mb-4 sm:flex sm:items-center sm:-mx-2">
                            <button type="button" onClick={()=>dispatch(ClosePriorityModal())} className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                                Cancel
                            </button>

                            <button onClick={(e)=>{handleSubmit(e)}} type="button" className={`${disabledBtn && "disabled"} w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40`}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
        </div>}

       { props.state=="update" && <div className="flex items-end justify-center min-h-screen px-4 pt-4  text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block px-4 pt-5 pb-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                    <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                        Update Priority Pairs
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Select suitable priority for country-operator pair.
                    </p>
                    <hr className='mt-2 mb-4'/>
                    <form className="mt-4" action="#">
                        {/* <div className='flex flex-wrap w-full justify-evenly'>
                        <div className='w-1/2 p-2'>
                        <p className='text-sm mb-2 text-gray-800'>Country</p>
                        <Dropdown options={countries} setValue={setselectedCountry}/>
                        </div>
                        <div className={`${!selectedCountryValue && "disabled"} w-1/2 p-2`}>
                        <p className='text-sm mb-2 text-gray-800'>Operator</p>
                        
                        <Dropdown options={operators[selectedCountryValue]} setValue={setselectedOperator}/>
                        </div>
                        </div> */}

                        <div className='mb-4 p-2'>
                        <p className='text-sm mb-2 text-gray-800'>High Priority?</p>
                        <Dropdown options={priority} setValue={setselectedProgram}/>
                        </div>

                        <div className={`${showAlert? "opacity-100 py-3":"opacity-0 h-0"} px-4  mb-4 text-sm
                  ${alertStatus?"text-green-800 bg-green-50 dark:text-green-400":"text-red-800 bg-red-50 dark:text-red-400"}  rounded-lg  dark:bg-gray-800  smooth`} role="alert">
                     {alertText}
                    </div>

                        <div className="mt-2 mb-4 sm:flex sm:items-center sm:-mx-2">
                            <button type="button" onClick={()=>dispatch(ClosePriorityModal())} className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                                Cancel
                            </button>

                            <button onClick={(e)=>{handleUpdate(e)}} type="button" className={`${disabledBtn && "disabled"} w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40`}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
        </div>}

        
    </div>
</div>
    </div>
  )
}

export default PriorityModal