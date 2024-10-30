import React from 'react'
import { Outlet } from 'react-router-dom'
type Props = {
    // Outlet:React.ReactElement|null
}

const Container = (props: Props) => {
    // const isSidebarOpen=useSelector((store:RootState)=>store.app.isSidebarOpen)

  return (
    <div className='w-full bg-gray-50 h-full max-h-screen p-4  overflow-y-auto'>
        <div className=' rounded-lg ' >
            <Outlet/>
        </div>
    </div>
  )
}

export default Container