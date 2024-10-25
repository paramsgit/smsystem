import React, { useState } from 'react';
import Select from 'react-select';
interface Option {
    value: string;
    label: string;
  }
  interface AppProps {
    options: Option[];
    setValue: React.Dispatch<React.SetStateAction<Option|null>>;
    
  }


 export const Dropdown: React.FC<AppProps> = ({ options,setValue }) => {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
      const handleChange = (value: Option | null) => {
        setSelectedOption(value);
    setValue(value);
  };
  return (
      <Select
        defaultValue={selectedOption}
        onChange={(e)=>{handleChange(e as Option);}}
        options={options}
      />
  );
}



// import { useState } from "react";
// import Select from "react-tailwindcss-select";





// export const Dropdown: React.FC<AppProps> = ({ options,setValue }) => {
//   const [animal, setAnimal] = useState<Option | null>(null);



//   return (
//     <Select
//       value={animal}
//       onChange={(e)=>handleChange(e as Option)}
//       options={options}
//       primaryColor="blue"
//       classNames={{  menuButton: () => (
//         `flex text-sm px-2 text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none`
//     ),}}
//     />
//   )};