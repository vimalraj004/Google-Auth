"use client";
import React, { useState, useEffect } from "react";
import {registerAndLoginService} from "../commonService/page"
import style from "../page.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


interface Registerformprops{
  handleCloseBtn(form:string):void
}

const Registerform = ({handleCloseBtn}:Registerformprops) => {
  // console.log(setShowForms)
  const [showPassword, setShowPassword] = useState(false);
  let initalstateforuser ={
    name:"",
    email:"",
    password:"",
  }
  const [userData,setUserData]= useState(initalstateforuser)
  // console.log(userData)
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const signup = async()=>{
    console.log("entered")
    try{
      let body ={
        userData
      }
      console.log(body)
  const response = await registerAndLoginService("/api/register/signup","post",body)
  console.log(response)

    }
    catch(error){
        console.log(error)
    }
}

  return (
  
    <div className={style.regform}>
    <h3 className={style.regclosebtn} onClick={()=>handleCloseBtn("reg")}>X</h3>
      <TextField
        label="Enter Your Name"
        variant="outlined"
        placeholder="Enter Your Name"
        type="text"
        value={userData.name}
        onChange={(e)=>setUserData({...userData,name:e.target.value})}
        sx={{
          input: {
            color: "white", // input text color
          },
          width: "74%",
          "& .MuiInputLabel-root": {
            color: "white", // default label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "red", // 🔥 focused label color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // default border
            },
            "&:hover fieldset": {
              borderColor: "white", // border on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // 🔥 border on focus
            },
          },
        }}
      />
      <TextField
        label="Enter Your Mail"
        variant="outlined"
        placeholder="Enter Your Mail"
        type="email"
        value={userData.email}
        onChange={(e)=>setUserData({...userData,email:e.target.value})}
        sx={{
          input: {
            color: "white", // input text color
          },
          width: "74%",
          "& .MuiInputLabel-root": {
            color: "white", // default label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "red", // 🔥 focused label color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // default border
            },
            "&:hover fieldset": {
              borderColor: "white", // border on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // 🔥 border on focus
            },
          },
        }}
      />
      <FormControl
        sx={{
          m: 1,
          width: "27ch",
          input: {
            color: "white",
          },
          "& .MuiInputLabel-root": {
            color: "white", // default label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "red", // 🔥 focused label color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // default border
            },
            "&:hover fieldset": {
              borderColor: "white", // border on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // 🔥 border on focus
            },
          },
        }}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">
          Enter Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          value={userData.password}
          onChange={(e)=>setUserData({...userData,password:e.target.value})}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          placeholder="Enter Password"
        />
      </FormControl>
   
      <Button
        variant="outlined"
        sx={{ color: "white", border: " 1px solid white", width: "74%" }}
      >
        Signin With Google
      </Button>
      <Button
        variant="outlined"
        sx={{ color: "white", border: " 1px solid white" }}
        onClick={signup}
      >
        Signup
      </Button>
    </div>
  );
};

export default Registerform;
