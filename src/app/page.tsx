"use client";
import { useState, useEffect } from "react";
import style from "./page.module.css";
import Loginform from "./Loginform";
import Registerform from "./Registerform";
const page = () => {
  let initialstate ={
    showregform :false,
    showloginform:false
  }
  const [showForms,setShowForms]= useState(initialstate)
  const mouseHoverOnContainer = (container:string )=>{
    if(container === "reg"){
      setShowForms({showregform : true, showloginform : false})  
    
    }
    else{
      setShowForms({showregform : false, showloginform : true})  

    }
  }
  const mouseLeaveOnContainer =()=>{
    setShowForms({showregform : false, showloginform : false})  
  }
  return (
    <div className={style.body}>
      <div className={style.container}>
        <div className={style.regcontainer} onMouseOver={()=>mouseHoverOnContainer("reg")} onMouseLeave={mouseLeaveOnContainer}>
          <h2 style={{ paddingBottom: "10px" }}>REGISTER</h2>
          {showForms.showregform && 
             <Registerform/>  
          }
            
        </div>
        <div className={style.logincontainer} onMouseOver ={()=>mouseHoverOnContainer("login")} onMouseLeave={mouseLeaveOnContainer}>
          <h2 style={{ paddingBottom: "10px" }}>LOGIN</h2>
          {showForms.showloginform && 
              <Loginform/>
          }
        
        </div>
      </div>
    </div>
  );
};

export default page;
