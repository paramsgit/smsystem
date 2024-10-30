import React, { useEffect } from 'react'
import { OpenSmsModal } from '../../utils/appSlice'
import { useDispatch } from 'react-redux'
import SmsModal from './smsModal'
import { io } from 'socket.io-client'
import { BarGraph } from '../ui/chartsCompo'
type Props = {}
const socket = io('http://127.0.0.1:5000');

const Sms = (props: Props) => {
  const dispatch=useDispatch()
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
  
  return (
    <div>
      <button onClick={()=>{dispatch(OpenSmsModal())}}>Open</button>
      <SmsModal socket={socket}/>
      <BarGraph />
    </div>
  )
}

export default Sms