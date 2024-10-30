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
      <button onClick={()=>{dispatch(OpenSmsModal())}}>Open</button>
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
    </div>
  )
}

export default Sms