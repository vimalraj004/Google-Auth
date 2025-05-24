import { beforeEach, describe } from "node:test";
import {POST} from "../app/api/user/signup/route"
import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import { decryptdata } from "@/helpers/page";
import bcrypt from "bcryptjs";
jest.mock("@/models/userModel")
jest.mock("@/helpers/page",()=>({
    decryptdata:jest.fn()
}))
jest.mock("bcryptjs",()=>({
    genSalt: jest.fn(),
    hash: jest.fn()
}))
const mockedusermodel = jest.mocked(User)
const mockeduserconstructor = User as jest.Mock;
const mockedDecryptData = decryptdata as jest.MockedFunction<typeof decryptdata>
const mockedbcrypt = jest.mocked(bcrypt);

describe("signUpFunctionality",()=>{
    let mockRequest={
        json:jest.fn()
     }

    beforeEach(()=>{
     jest.clearAllMocks()


     })
    it("should check all the required fields are their",async()=>{
     mockRequest.json.mockResolvedValue({name:"",email:"",password:""})
       const response = await POST(mockRequest as unknown as NextRequest)
       expect(response.status).toBe(400)
      const result = await response.json()
      expect(result.message).toBe("Required data is missing")
    })


    // validation for all the fields:
    describe("validation for all the fields",()=>{
          // validation for the name
            it("name should contain at least 4 char",async()=>{
            mockRequest.json.mockResolvedValue({name:"abi",email:"abi@gmail.com",password:"Spm@1234"})
            //   mockedDecryptData.mockResolvedValue("Spm@1234")
             const response = await POST(mockRequest as unknown as NextRequest)
             expect(response.status).toBe(400)
             const result = await response.json()
             expect(result.message[0].message).toBe("Name must be have 4 character long")
            })
            // validation for email
            it("should be in email format",async()=>{
                mockRequest.json.mockResolvedValue({name:"vimal",email:"vimal",password:"Spm@1234"})
                const response = await POST(mockRequest as unknown as NextRequest)
                expect(response.status).toBe(400)
                const result = await response.json()
                expect(result.message[0].message).toBe("Invalid email address")
            })
            // validation for password
        
                test.each([
                    ["abc","password length should contain at least 6 char"],
                    ["abcsdrefd","password should contain at least 1 uppercase"],
                    ["ABSDFECS","password should contain at least 1 lowercase"],
                    ["adfaADFADF","password should contain at least 1 special char"],
                    ["asdfasADSFAS@#$","password should contain at least 1 number"]
                ])("password validation",async(password,expectedMessage)=>{
                    mockRequest.json.mockResolvedValue({
                        name:"vimalraj",
                        email:"vimalrajvj1048@gmail.com",
                        password
                    })
                    const response = await POST(mockRequest as unknown as NextRequest)
                    expect(response.status).toBe(400)
                    const result = await response.json()
              })
        
    })

    // Duplicate user
    
    it("should check the user email is exist or not",async()=>{
          mockRequest.json.mockResolvedValue({name:"vimalraj",email:"vimalrajvj1048@gmail.com",password:"Spm@1234"})
          mockedDecryptData.mockResolvedValue("Spm@1234")
          mockedusermodel.findOne.mockResolvedValue({email:"vimalrajvj1048@gmail.com"})
          const response = await POST(mockRequest as unknown as NextRequest)
          expect(mockedusermodel.findOne).toHaveBeenCalledWith({email:"vimalrajvj1048@gmail.com"})
          expect(response.status).toBe(409)
          const result = await response.json()
          expect(result.message).toBe("email already exist")
        })

    // Process to save the data in db

    describe("Process to save the data in db",()=>{
        // success
        it("Data saved",async()=>{
            mockRequest.json.mockResolvedValue({name:"taresh",email:"taresh@gmail.com",password:"Spm@1234"})
            mockedDecryptData.mockResolvedValue("Spm@1234")
            mockedusermodel.findOne = jest.fn().mockResolvedValue(null);            
            mockedbcrypt.genSalt.mockResolvedValue("salt" as never);
            mockedbcrypt.hash.mockResolvedValue("hashedpassword" as never);
            const mocksave = jest.fn().mockResolvedValue(true)
            mockeduserconstructor.mockImplementation(()=>({save:mocksave}))
            const response = await POST(mockRequest as unknown as NextRequest)
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
            expect(bcrypt.hash).toHaveBeenCalledWith("Spm@1234","salt")
            expect(mocksave).toHaveBeenCalled()
            expect(response.status).toBe(201)
            const result = await response.json()
            expect(result.message).toBe("Data saved successfully")
        })
        // failure
        it("Failed to save the data ",async()=>{
            mockRequest.json.mockResolvedValue({name:"taresh",email:"taresh@gmail.com",password:"Spm@1234"})
            mockedDecryptData.mockResolvedValue("Spm@1234")
            mockedusermodel.findOne = jest.fn().mockResolvedValue(null)
            mockedbcrypt.genSalt.mockResolvedValue("salt" as never)
            mockedbcrypt.hash.mockResolvedValue("hashedpassword" as never)
            const mocksave = jest.fn().mockResolvedValue(null)
            mockeduserconstructor.mockImplementation(()=>({save:mocksave}))
            const response = await POST(mockRequest as unknown as NextRequest)
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
            expect(bcrypt.hash).toHaveBeenCalledWith("Spm@1234","salt")
            expect(mocksave).toHaveBeenCalled()
            expect(response.status).toBe(400)
            const result =await response.json()
        
            expect(result.message).toBe("Failed to save the data")
        })


    })

    // Internal server error 

    it("should check the unexpected error",async()=>{
        mockRequest.json.mockRejectedValue(new Error("unexpected error"))
        const response = await POST(mockRequest as unknown as NextRequest)
        expect(response.status).toBe(500)
        const result = await response.json()
        expect(result.error).toBe("unexpected error")
    })


    

})


