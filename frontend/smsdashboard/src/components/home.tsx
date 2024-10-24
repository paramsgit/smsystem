import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkAuthToken } from '../utils/isLoggedIn'
import Sidebar from './sidebar'
import Container from './container'
type Props = {}

const Home = (props: Props) => {
    const navigate = useNavigate();
    const [loggedIn,setloggedIn]=useState(false)
    const [loading,setloading]=useState(true)
    
    useEffect(() => {
    const token=checkAuthToken()
      if(token) {
        setloggedIn(true)
      }else{
        navigate("/signin")
      }
    }, [])

    useEffect(() => {
      const data=localStorage.getItem('auth-token')
      // if(data && data.name)
    }, [])
    
    

  return (
   <>
   
   {loggedIn ? <div> 

      <div className='flex'>
        <Sidebar/>
        <Container/>
      </div>

   </div> :<div> Loading....</div>}
   </>
  )
}

export default Home