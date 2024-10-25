export const countryCodes:{ [key: string]: string }={'india':"IN",'canada':"CA",'usa':'US'}
export const countries=[
{ value: "india", label: "India" },
{ value: "usa", label: "USA" },
{ value: "canada", label: "Canada" }
]
export const programs=[
{ value: "program1", label: "program1" },
{ value: "program2", label: "program2" },
]


interface Option {
    value: string;
    label: string;
  }
interface Operators {
    usa: Option[];
    india: Option[];
    canada: Option[];
    [key: string]: Option[]; // This index signature allows for string keys
  }
export const operators:Operators={

    "usa":[
{ value: "AT", label: "AT" },
{ value: "Mint", label: "Mint" },
{ value: "Verizon", label: "Verizon" },
{ value: "TMobile", label: "TMobile" },
],
    "india":[
{ value: "VI", label: "VI" },
{ value: "BSNL", label: "BSNL" },
{ value: "Jio", label: "Jio" },
{ value: "Airtel", label: "Airtel" },
],
    "canada":[
{ value: "Bell", label: "Bell" },
{ value: "Telus", label: "Telus" },
{ value: "Rogers", label: "Rogers" },
],

}

