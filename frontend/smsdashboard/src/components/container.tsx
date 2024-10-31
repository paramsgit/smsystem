import React from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openSidebar } from '../utils/appSlice'
type Props = {
    // Outlet:React.ReactElement|null
}

const Container = (props: Props) => {
  const dispatch=useDispatch()
    // const isSidebarOpen=useSelector((store:RootState)=>store.app.isSidebarOpen)

  return (
    <div className='w-full bg-gray-50 h-full max-h-screen p-4  overflow-y-auto'>
      <div className='my-3 block md:hidden'>
        <button onClick={()=>{dispatch(openSidebar())}} className='p-2 bg-gray-200 text-gray-500 rounded-lg'>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>
        </button>
         </div>
        <div className=' rounded-lg ' >
            <Outlet/>
        </div>
    </div>
  )
}

export default Container