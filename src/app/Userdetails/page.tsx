"use client"
import React, { use, useEffect, useState } from "react";
import style from "../Userdetails/userdetails.module.css";
import { commonService } from "@/helpers/page";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import {ScaleLoader} from "react-spinners"
import { useRouter } from "next/navigation";
type userdetailsprops = {
  setShowAllUser: React.Dispatch<React.SetStateAction<boolean>>;
};



const page = ({ setShowAllUser }: userdetailsprops) => {
  const navigate = useRouter()
  const [alluserdata, setAllUserData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(0);
  const [editRowData, setEditRowData] = useState<{ [keys: string]: any }>({});
  const [loader ,setLoader]= useState(false)
  const tableHeaders =
    alluserdata.length > 0 ? Object.keys(alluserdata[0]) : [];
  const getAllUserData = async () => {
    setLoader(true)
    try {
      const response = await commonService("/api/user/alluserdata", "GET",navigate);
      if (response.status === 200) {
        setAllUserData(response.data.data);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 500) {
        toast.error("Internal Server Errro");
      } else {
        toast.error(error.response.message);
      }
    }
    finally{
      setLoader(false)
    }
  };
  const closeUserDetailsBox = () => {
    setShowAllUser(false);
  };
  const handleEdit = (rowindex: number, data: object) => {
    setEditRowIndex(rowindex);
    setEditRowData({ ...data });
  };
  const handleDelete = async (data:object) => {
    try{
      let body ={
        ...data
      }
      const response = await commonService("/api/user/alluserdata","DELETE",body)
      if(response.status === 200){
        toast.success("Deleted Successfully")
        getAllUserData()
      }


    }catch(error:any){
      console.log(error);
      if (error.response.status === 500) {
        toast.error("Internal Server Errro");
      } else {
        toast.error(error.response.message);
      }
    }
  };
  const handleInputChange = (key:string, value: string) => {
    setEditRowData((prev) => ({ ...prev, [key]: value }));
  };
  const handleSave = async (data: object) => {
    try{
      let body ={
        ...data
      }
      const response = await commonService("/api/user/alluserdata","PUT",body)
      if(response.status === 200){
        toast.success("Updated Successfully")
        getAllUserData()
        setEditRowIndex(0)
        setEditRowData({})
      }

    }
    catch(error:any){
      console.log(error);
      if (error.response.status === 500) {
        toast.error("Internal Server Errro");
      } else {
        toast.error(error.response.message);
      }

    }
 
  };
  useEffect(() => {
    getAllUserData();
  }, []);
  return (
    <div className={style.body}>
      <div className={style.heading}>
        <h2
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingLeft: "38%",
            color:"black"
          }}
        >
          Registered Users
        </h2>
        <h2
          onClick={closeUserDetailsBox}
          style={{ cursor: "pointer", paddingRight: "20px" }}
        >
          x
        </h2>
      </div>
      {loader ?(
        <div className={style.loader}>
                   <ScaleLoader color="black"/>
        </div>
    
      ):(
              <div className={style.tablecontainer}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>SNO</th>
                    {tableHeaders.map((x1, index) => (
                      <th key={index}>{x1.toUpperCase()}</th>
                    ))}
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {alluserdata.map((users, rowindex) => (
                    <tr key={rowindex}>
                      <td>{rowindex + 1}</td>
                      {tableHeaders.map((x2, colIndex) => (
                        <td key={colIndex}>
                          {editRowIndex === rowindex + 1 && (x2 === "name" || x2 === "email") ? (
                            <input
                              type="text"
                              style={{border:"none",outline:"none",backgroundColor:"transparent", color:"black"}}
                              value={editRowData[colIndex]}
                              onChange={(e) =>
                                handleInputChange(x2, e.target.value)
                              }
                            ></input>
                          ) : (
                            users[x2]
                          )}
                        </td>
                      ))}
                      <td>
                        {editRowIndex === rowindex + 1 ? (
                          <FaCheck
                            style={{
                              cursor: "pointer",
                              marginRight: "10px",
                              color: "green",
                            }}
                            onClick={() => {
                              handleSave(editRowData);
                            }}
                          />
                        ) : (
                          <FaEdit
                            style={{ cursor: "pointer", marginRight: "10px" }}
                            onClick={() => handleEdit(rowindex + 1, users)}
                          />
                       
                        )}
                        {editRowIndex === rowindex +1 ?(
                          <FaTimes 
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => setEditRowIndex(0)}
                           />
                        ):(
                            <FaTrash
                            style={{ cursor: "pointer", color: "red" }}
                            onDoubleClick={() => handleDelete(users)}
                          />
                        )}
                      
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}



      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default page;
