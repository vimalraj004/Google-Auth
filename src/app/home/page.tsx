"use client"
import React, { useState } from 'react'
import style from "./home.module.css"
import Navbar from "../Navbar/page"
import Userdetails from "../Userdetails/page"

const page = () => {
  const[showAllUser,setShowAllUser]= useState(false)
  return (
    <div className={style.body}>
        <Navbar setShowAllUser={setShowAllUser} />
        <div className={style.userdetails}>
        {showAllUser && (
          <Userdetails setShowAllUser={setShowAllUser} />
        )}
        </div>
     
      
    </div>
  )
}

export default page