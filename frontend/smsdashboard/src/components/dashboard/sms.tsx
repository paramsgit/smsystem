import React, { useEffect,useRef, useState } from 'react'
import { OpenSmsModal } from '../../utils/appSlice'
import { useDispatch } from 'react-redux'
import SmsModal from './smsModal'
import { io } from 'socket.io-client'
import { BarGraph } from '../ui/chartsCompo'
import { RadialChart } from '../ui/radialCharts'
import { PieCharts } from '../ui/pie'
type Props = {}
const socket = io('http://127.0.0.1:5000');

const Sms = (props: Props) => {
  const dispatch=useDispatch()
  const barGraphRef = useRef(null);
  const radialChartRef = useRef(null);
  const [pieData, setpieData] = useState<TransformedData>({});
  const [totalC,settotalC]=useState(0)
  const [passed,setpassed]=useState(0)
  useEffect(() => {
    socket.on('server_message', (data: { status: string }) => {
      console.log('Connection status:', data);
    });
    socket.on('sms_update', (data: { status: string }) => {
      console.log('Sms status:', data);
    });
  
    return () => {
      socket.off('server_message');
    }
  }, [socket])

  type SmsData = {
    count: number;
    country: string;
    operator: string;
    status: string;
  };
  
  type TransformedData = {
    [country: string]: {
      [operator: string]: number;
    };
  };
  
  const inputData: SmsData[] = [
    { count: 15, country: "India", operator: "Jio", status: "sent" },
    { count: 21, country: "India", operator: "Airtel", status: "sent" },
    { count: 1, country: "india", operator: "VI", status: "failed" },
    { count: 2, country: "india", operator: "VI", status: "sent" },
    { count: 1, country: "usa", operator: "Verizon", status: "failed" },
    { count: 1, country: "usa", operator: "Verizon", status: "sent" },
  ];
  
  function transformData(data: SmsData[]): TransformedData {
    let totalCount=0;
    let passedCount=0;
    
    const returnVal= data.reduce<TransformedData>((result, { country, operator, count,status }) => {
      const normalizedCountry = country.toLowerCase(); // Normalize country names
      
      // Initialize country if not present
      if (!result[normalizedCountry]) {
        result[normalizedCountry] = {};
      }
  
      // Initialize operator if not present
      if (!result[normalizedCountry][operator]) {
        result[normalizedCountry][operator] = 0;
      }
  
      // Accumulate the SMS count for the operator
      result[normalizedCountry][operator] += count;
      totalCount+=count;
      if(status==="sent")
         passedCount+=count
        setpieData(result)
      return result;
    }, {});
      setpassed(passedCount);
      settotalC(totalCount)
return returnVal
  }
  
  useEffect(() => {

  
      const getMetrics=async()=>{
          const response=await fetch(`http://localhost:5000/api/metrics`);
          const responsedata=await response.json();
          const transformedData = transformData(responsedata);
          console.log(responsedata)
      }
      getMetrics()
   


    // const transformedData = transformData(inputData);

  }, [])
    
  

  
  return (
    <div>
      {/* <button >Open</button> */}
      <SmsModal socket={socket}/>
      <div className='flex flex-col md:flex-row justify-evenly items-center'> 
      <BarGraph />
      <RadialChart total={totalC} passed={passed}/>
      </div>
      <div className='flex justify-evenly flex-wrap py-8'>
        {/* <PieCharts/>
        <PieCharts/>
        <PieCharts/> */}
        {Object.entries(pieData).map((p) => (
          <PieCharts data={p}/>
         
      ))}
         </div>

         <section className="bg-white rounded-xl mb-4 dark:bg-gray-900">
    <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
        <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
            Bring your Business to the <span className="text-blue-500">next level.</span>
        </h2>

        <p className="max-w-4xl mt-6 text-center text-gray-500 dark:text-gray-300">
        Experience seamless SMS sending with our service. We ensure timely delivery, reliable communication, and user-friendly features to meet your needs. Trust us to keep you connected effortlessly and efficiently. Join us today and elevate your messaging experience with our exceptional service!
        </p>

        <div className="inline-flex  w-full mt-6 sm:w-auto">
            <button onClick={()=>{dispatch(OpenSmsModal())}} className="inline-flex items-center justify-center w-full px-6 py-2 text-white duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                Send SMS
            </button>
        </div>
    </div>
</section>

    </div>
  )
}

export default Sms