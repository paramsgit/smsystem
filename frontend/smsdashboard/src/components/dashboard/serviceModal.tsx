import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../utils/store'
import { CloseServiceModal } from '../../utils/appSlice'
import { countries,operators, programs } from '../../utils/helper'
import { Dropdown } from '../../utils/dropdown'
import { getAuthToken } from '../../utils/isLoggedIn'

type Props = {
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Option {
    value: string;
    label: string;
  }
 
const ServiceModal = (props: Props) => {
    const dispatch=useDispatch()
    const isModalOpen=useSelector((store:RootState)=>store.app.isServiceModalOpen)
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

        if(!selectedProgram || !selectedOperator || !selectedCountryValue){
            setalertText("Select all the fields");setalertStatus(false); setshowAlert(true);            setdisabledBtn(false);
            return;
        }
        const authToken=getAuthToken();
        if(!authToken){setalertText(`Error, Login again!!
        `);setalertStatus(false); setshowAlert(true);setdisabledBtn(false);
        return;

        }

        const reqData=JSON.stringify({ country:selectedCountryValue,operator:selectedOperator.value,program:selectedProgram.value })

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
                 setalertText(result?.message);
                  setalertStatus(true); 
                  setshowAlert(true);
                  props.setRefresh(!(props.refresh))
               
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
    

  return (
    <div>
        <div className="relative flex justify-center">
    {/* <button className="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
        Open Modal
    </button> */}

    <div
        
        className={`fixed ${isModalOpen?"":"hidden"} inset-0 z-10 overflow-y-auto bg-black/70`} 
        
    >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4  text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                    <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                        Start new session
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                       Select country and oprator with required Service.
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
                        <p className='text-sm mb-2 text-gray-800'>Service</p>
                        <Dropdown options={programs} setValue={setselectedProgram}/>
                        </div>

                        <div className={`${showAlert? "opacity-100 py-3":"opacity-0 h-0"} px-4  mb-4 text-sm
                  ${alertStatus?"text-green-800 bg-green-50 dark:text-green-400":"text-red-800 bg-red-50 dark:text-red-400"}  rounded-lg  dark:bg-gray-800  smooth`} role="alert">
                     {alertText}
                    </div>

                        <div className="mt-2 mb-4 sm:flex sm:items-center sm:-mx-2">
                            <button type="button" onClick={()=>dispatch(CloseServiceModal())} className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                                Cancel
                            </button>

                            <button onClick={(e)=>{handleSubmit(e)}} type="button" className={`${disabledBtn && "disabled"} w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40`}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
        </div>
    </div>
</div>
    </div>
  )
}

export default ServiceModal