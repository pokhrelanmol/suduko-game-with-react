import React, { useState } from "react";
import "./suduko.css";

const getValue= (targetValue)=>{
 const value = +targetValue 
 if(value <10 && value>0){
   return value
 }
 return ""
 
}


const InputField = ({data, changeValue}) => {
  const[value,setValue] = useState(data.value?data.value:"")

  const handleChange = (e)=>{
    const _val = getValue(e.target.value)
      setValue(_val)
      changeValue({...data,value:_val?_val:null})
  }
  return (
    <input
      className="input_field"
      type="number"
      value={value}
      id="input"
  
      onChange= {handleChange}
      readOnly={data.readOnly}
    />
  );
};

export default InputField;
