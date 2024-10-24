import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import store from '../utils/store'
import { RootState } from '../utils/store'
type Props = {}

const Container = (props: Props) => {
    const isSidebarOpen=useSelector((store:RootState)=>store.app.isSidebarOpen)

  return (
    <div className='w-full h-full max-h-screen p-4  overflow-y-auto'>
        <div className='bg-red-100 rounded-lg h-[200vh]' >
            {isSidebarOpen?"true":"false"}
        </div>
    </div>
  )
}

export default Container