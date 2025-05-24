"use client";
import React, { useState, useEffect } from "react";
import { registerAndLoginService } from "../../helpers/page";
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
import { encryptdata } from "../../helpers/page";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { ScaleLoader } from "react-spinners";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
interface Registerformprops {
  handleCloseBtn(form: string): void;
}
interface googleuserdata {
  displayName: string | null;
  email: string | null;
  uid: string | null;
  photoURL: string | null;
}

const Registerform = ({ handleCloseBtn }: Registerformprops) => {
  const provider = new GoogleAuthProvider();
  const navigate = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  let initalstateforuser = {
    name: "",
    email: "",
    password: "",
  };
  const [userData, setUserData] = useState(initalstateforuser);
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
  const signup = async () => {
    setLoader(true);
    if (!userData.name || !userData.email || !userData.password) {
      toast.error("Fill all the Fields");
      setLoader(false);
      return;
    }

    try {
      const uservalidation = z.object({
        name: z
          .string()
          .min(4, { message: "Name must be have 4 character long" })
          .regex(/^[A-Za-z]+$/, {
            message: "Name field should not contain special character",
          }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
          .string()
          .min(6, { message: "password length should be at least 6 char long" })
          .regex(/[a-z]/, {
            message: "Password should contain at least one lower case",
          })
          .regex(/[A-Z]/, {
            message: "Password should contain at least one upper case",
          })
          .regex(/[0-9]/, {
            message: "Password should contain at least one Number",
          })
          .regex(/[^a-zA-Z0-9]/, {
            message: "Password should contain at least one special char",
          }),
      });
      const result = await uservalidation.safeParse({ ...userData });
      if (!result.success) {
        result.error.issues.forEach((x) => {
          toast.error(x.message);
        });
        setLoader(false);
      } else {
        let body = {
          ...userData,
          password: encryptdata(userData.password),
        };
        const response = await registerAndLoginService(
          "/api/user/signup",
          "post",
          body
        );
        if (response!.status === 201) {
          toast.success("Registerd successfully");
          setUserData(initalstateforuser);
          setLoader(false);
          setTimeout(() => {
            handleCloseBtn("reg");
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendData = async (user: googleuserdata) => {
    try {
      let body = {
        name: user.displayName,
        email: user.email,
        googleid: user.uid,
        googleimg: user.photoURL,
      };
      const response = await registerAndLoginService(
        "/api/user/googlereg",
        "post",
        body
      );
      if (response.status === 200) {
        toast.success("Loggedin Successfully");
        setLoader(false);

        setTimeout(() => {
          handleCloseBtn("reg");
          navigate.push("/home");
        }, 800);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 500) {
        toast.error("Internal Server Error");
        setLoader(false);
      } else {
        toast.error(error.response.data.message);
        setLoader(false);
      }
    }
  };
  const signUpWithGoogle = async () => {
    try {
      setLoader(true);
      const auth = getAuth();
      signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        sendData(user);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      signup();
    }
  };

  return (
    <div className={style.regform}>
      <h3 className={style.regclosebtn} onClick={() => handleCloseBtn("reg")}>
        X
      </h3>
      <TextField
        label="Enter Your Name"
        variant="outlined"
        placeholder="Enter Your Name"
        type="text"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        onKeyDown={handleKeyDown}
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
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        onKeyDown={handleKeyDown}
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
        onKeyDown={handleKeyDown}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">
          Enter Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
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
                {showPassword ? (
                  <VisibilityOff sx={{ color: "white" }} />
                ) : (
                  <Visibility sx={{ color: "white" }} />
                )}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          placeholder="Enter Password"
        />
      </FormControl>

         <Button
        variant="outlined"
        sx={{
          color: "#555",
          border: "1px solid #ccc",
          width: "74%",
          backgroundColor: "#fff",
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#f5f5f5",
            borderColor: "#aaa",
          },
        }}
        startIcon={<FaGoogle style={{ color: "#DB4437" }} />}
        onClick={signUpWithGoogle} // fixed typo: "singInWithGoogle"
      >
        Google SignUp
      </Button>
      {loader ? (
        <ScaleLoader color="white" />
      ) : (
        <Button
          variant="outlined"
          sx={{ color: "white", border: " 1px solid white" }}
          onClick={signup}
        >
          Signup
        </Button>
      )}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default Registerform;
