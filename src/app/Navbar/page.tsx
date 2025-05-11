"use client";
import React, { useEffect, useState } from "react";
import style from "./navbar.module.css";
import { Button } from "@mui/material";
import { commonService } from "@/helpers/page";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
type navbarprops = {
  setShowAllUser: React.Dispatch<React.SetStateAction<boolean>>;
};

const page = ({ setShowAllUser }: navbarprops) => {
  type USERDATA = {
    userName: string;
    userID: string;
    userEmail: string;
    userImg: string;
  };
  const initialuserData = {
    userName: "",
    userEmail: "",
    userID: "",
    userImg: "",
  };
  const navigate = useRouter();
  const [userData, setUserData] = useState<USERDATA>(initialuserData);
  console.log(userData);
  const logout = async () => {
    try {
      const auth = getAuth();
      let body = {
        accesstoken: Cookies.get("accessToken"),
        refreshtoken: Cookies.get("refreshToken"),
      };
      const response = await commonService("/api/user/logout", "GET", body);
      if (response.status === 200) {
        await signOut(auth);
        toast.success("Logout Successfully");
        navigate.push("/");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 500) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.message);
      }
    }
  };
  const getUserData = async () => {
    try {
      const response = await commonService("/api/user/me", "GET");
      if (response.status === 200) {
        setUserData(response.data.data);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 500) {
        toast.error("Internal Server Errro");
      } else {
        toast.error(error.response.message);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className={style.navcontainer}>
      <Avatar alt="Remy Sharp" src={userData?.userImg}/>


      <h1
        style={{
          color: "white",
          fontFamily: "sans-serif",
          alignItems: "center",
          paddingLeft: "100px",

        }}
      >
        welcome {userData.userName}
      </h1>
        <div>
             <Button
        variant="outlined"
        sx={{ color: "white", border: " 1px solid white" }}
        onClick={() => {
          setShowAllUser(true);
        }}
      >
        USER DETAILS
      </Button>
            <Button
        variant="outlined"
        sx={{ color: "white", border: "1px solid white",marginLeft:"10px" }}
        onClick={logout}
      >
     
        Logout
      </Button>
        </div>
   
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default page;
