"use client";
import { useState, useEffect } from "react";
import style from "./page.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Loginform = () => {
  const [showPassword, setShowPassword] = useState(false);

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
  return (
    <div className={style.loginform}>
      <TextField
        label="Enter Your Mail"
        variant="outlined"
        placeholder="Enter Your Mail"
        type="email"
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
          width: "25ch",
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
        Login With Google
      </Button>
      <Button
        variant="outlined"
        sx={{ color: "white", border: " 1px solid white" }}
      >
        Login
      </Button>
    </div>
  );
};

export default Loginform;
