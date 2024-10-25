import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkAuthToken } from '../utils/isLoggedIn'
import Sidebar from './sidebar'
import Container from './container'
type Props = {}

const Home = (props: Props) => {
    const navigate = useNavigate();
    const [loggedIn,setloggedIn]=useState(false)
    // const [loading,setloading]=useState(true)
    const [name,setname]=useState("")
    
    useEffect(() => {
    const token=checkAuthToken()
      if(token) {
        setloggedIn(true)
      }else{
        navigate("/signin")
      }
    }, [navigate])

    useEffect(() => {
      let authdata=localStorage.getItem('auth-token')
      let data;
      if(authdata)
      data=JSON.parse(authdata)

      if(data && data.name){
        setname(data.name)
      }
    }, [])
    
    

  return (
   <>
   
   {loggedIn ? <div> 

      <div className='flex'>
        <Sidebar name={name}/>
        <Container />
      </div>

   </div> :<div> Loading....</div>}
   </>
  )
}

export default Home