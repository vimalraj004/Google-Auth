"use client";
import { useState, useEffect } from "react";
import style from "./page.module.css";
import Loginform from "./Login/page";
import Registerform from "./Register/page";
import { initializeMyFireBase } from "@/firebase/firebase";
const page = () => {
  let initialstateforforms ={
    showregform :false,
    showloginform:false
  }
  const [showForms,setShowForms]= useState(initialstateforforms)
  const openForm = (formname:string)=>{
    if(formname === "register"){
      setShowForms({...showForms,showregform:true})
    }
    else{
      setShowForms({...showForms,showloginform:true})
    }
  }
  const handleCloseBtn =(form:string):void=>{
    if(form === "reg"){
      setShowForms((prev)=>({...prev,showregform:false}))
    }else{
      setShowForms((prev)=>({...prev,showloginform:false}))
    }
  }
  useEffect(()=>{
    initializeMyFireBase()

  },[])

  return (
    <div className={style.body}>
      <div className={style.container}>
        <div className={style.regcontainer} >
          <h2 className={style.heading} onClick={()=>openForm("register")}>REGISTER</h2>
          {showForms.showregform && 
             <Registerform  handleCloseBtn={handleCloseBtn}/>  
          }
            
        </div>
        <div className={style.logincontainer}>
          <h2 className={style.heading} onClick={()=>openForm("login")}>LOGIN</h2>
          {showForms.showloginform && 
              <Loginform   handleCloseBtn={handleCloseBtn} />
          }
        
        </div>
      </div>
    </div>
  );
};

export default page;
