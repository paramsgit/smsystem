import React, { useEffect, useState } from 'react'
import { CoTable } from '../ui/coTable'

type Props = {}

const Prioritize = (props: Props) => {
  const [pairsData,setpairsData]=useState([])
  const [refresh,setrefresh]=useState(false)

  useEffect(() => {

  
    const getpairs=async()=>{
        const response=await fetch(`http://localhost:5000/api/operators/pairs`);
        const responsedata=await response.json();
        console.log(responsedata)
        setpairsData(responsedata)
    }
    getpairs()
 
}, [refresh])

  return (
    <div>
      <CoTable refresh={refresh} setRefresh={setrefresh} data={pairsData}/>
    </div>
  )
}

export default Prioritize