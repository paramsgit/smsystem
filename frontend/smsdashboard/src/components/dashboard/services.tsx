import React from 'react'
import ServicesTable from '../ui/servicesTable'

type Props = {}

export const Services = (props: Props) => {
  return (
    <div className='my-12 p-4 md:py-6 bg-white shadow md:rounded-2xl'>
     <ServicesTable/>
    </div>
  )
}