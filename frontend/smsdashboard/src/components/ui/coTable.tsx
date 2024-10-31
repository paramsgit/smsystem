import React, { useState } from 'react';
import { FilePenLine, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import PriorityModal from './priorityModel';
import { OpenPriorityModal } from '../../utils/appSlice';
interface DataItem {
  country: string;
  id: number;
  is_high_priority: number;
  operator: string;
}

interface Props {
  data: DataItem[];
  refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;

}

export const CoTable: React.FC<Props> = ({ data,refresh,setRefresh }) => {
    const dispatch=useDispatch()
    const [modalState,setmodalState]=useState("")
    const [PairId,setPairId]=useState(0)
  return (
    <div className="overflow-x-auto">

    <div className="faltu mt-3 mb-5 px-4 ">
    

    <div className="w-full bg-center rounded-xl bg-cover h-[12rem]" style={{backgroundImage:"url('/earth.jpeg')"}}>
        <div className="flex items-center justify-center w-full h-full ">
            <div className="text-center">
                <h1 className="text-lg font-semibold text-white lg:text-2xl ">Create new country operator priority pair </h1>
                <button onClick={()=>{setmodalState("add");dispatch(OpenPriorityModal())}} className="w-full px-5 py-2 mt-4 text-sm  font-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">Create New</button>
            </div>
        </div>
    </div>

    </div>

<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 rounded-lg dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Country - Operator
                </th>
                <th scope="col" className="px-6 py-3">
                    Priority
                </th>
               
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
               
            

            {data.map((d)=>{
                return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {d.country}-{d.operator}
                </th>
                <td className="px-6 py-4">
                    {d.is_high_priority}
                </td>
                <td className="px-6 py-4">
                    <div className='flex items-center'>
                        {/* <div> <FilePenLine /></div> */}
                        <button onClick={()=>{setmodalState("update");setPairId(d.id);dispatch(OpenPriorityModal())}} className='mx-2 bg-blue-50 rounded-md p-1'> <FilePenLine color='#3198d8'/></button>
                        <button onClick={()=>{setmodalState("delete");setPairId(d.id);dispatch(OpenPriorityModal())}} className='mx-2 bg-red-100 rounded-md p-1'> <Trash2 color='#d83131'/></button>
                    
                    </div>
                </td>
               
            </tr>
            })}
           
        </tbody>
    </table>

  {data.length===0 &&  <div className="flex items-center mt-6 text-center border rounded-lg h-96 dark:border-gray-700">
        <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
            <div className="p-3 mx-auto text-blue-500 bg-blue-100 rounded-full dark:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
            <h1 className="mt-3 text-lg text-gray-800 dark:text-white">No Pair found</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">No country-Operator priority pair found. Please try again or create a new pair.</p>
            <div className="flex items-center justify-center mt-4 sm:mx-auto gap-x-3">

                <button onClick={()=>{setmodalState("add");dispatch(OpenPriorityModal())}} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    <span>Add pair</span>
                </button>
            </div>
        </div>
    </div>}

    <PriorityModal refresh={refresh} setRefresh={setRefresh} state={modalState} id={PairId}/>
</div>

    </div>
  );
};

