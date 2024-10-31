import React from 'react'
import { MemoryStick,Cpu } from 'lucide-react'
interface SystemStats {
    free_ram: number;
    total_ram: number;
    cpu_usage: number;
  }
  
  interface Props {
    data: SystemStats;
  }
  
const SystemUsage = ({data}: Props) => {
  return (
    <div>
                 <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className='text-xs mx-2'> <Cpu size={18}/></span>
                {data.cpu_usage} <span className='mx-1 text-gray-500/70 dark:text-gray-400/70'> % Used</span>
                </p>
                <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className='text-xs mx-2'> <MemoryStick size={18}/></span>
                {data.free_ram} <span className='mx-1 text-gray-500/70 dark:text-gray-400/70'> MB Availble</span>
                </p>
       
    </div>
  )
}


export default SystemUsage