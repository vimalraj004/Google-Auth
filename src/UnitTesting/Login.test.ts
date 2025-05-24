import { describe,beforeEach, mock } from "node:test";
import { NextRequest } from "next/server";
import User from "@/models/userModel";
import { POST } from "@/app/api/user/login/route";
import { decryptdata } from "@/helpers/page";
import bcrypt, { compare, genSalt, hash } from "bcryptjs";
jest.mock("@/models/userModel")
jest.mock("@/helpers/page",()=>({
    decryptdata:jest.fn()
}))
jest.mock("bcryptjs",()=>({
    genSalt:jest.fn(),
    hash:jest.fn(),
    compare:jest.fn()
}))

const mockedusermodel = jest.mocked(User)
const mockedDecryptData = decryptdata as jest.MockedFunction<typeof decryptdata>
const mockedbcrypt = jest.mocked(bcrypt)

describe("loginFunctionality",()=>{
    let mockrequest ={
        json:jest.fn()
    }
    beforeEach(()=>{
        jest.clearAllMocks()
    })
    // Required Fields
    it("should contain all required fields",async()=>{
        mockrequest.json.mockResolvedValue({email:"",password:""})
        const response = await POST(mockrequest as unknown as NextRequest)
        expect(response.status).toBe(400)
        const result = await response.json()
        expect(result.message).toBe("Required data is missing")
    })

    // validation for all the fields
    describe("validation for all the fields",()=>{
        // validation for the email
        it("should check the email format",async()=>{
            mockrequest.json.mockResolvedValue({email:"vimalraj",password:"Spm@1234"})
            // mockedDecryptData.mockResolvedValue("Spm@1234")
            const response = await POST(mockrequest as unknown as NextRequest)
            expect(response.status).toBe(400)
            const result= await response.json()
            expect(result.message[0].message).toBe("Invalid email address")
        })
        // validation for password
           test.each([
                    ["abc","password length should contain at least 6 char"],
                    ["abcsdrefd","password should contain at least 1 uppercase"],
                    ["ABSDFECS","password should contain at least 1 lowercase"],
                    ["adfaADFADF","password should contain at least 1 special char"],
                    ["asdfasADSFAS@#$","password should contain at least 1 number"]
                ])("should check the password validations",async(password,expectedMessage)=>{
                    mockrequest.json.mockResolvedValue({email:"vimalrajvj1048@gmail.com",password})
                    // mockedDecryptData.mockResolvedValue("Spm@1234")
                    const response = await POST(mockrequest as unknown as NextRequest)
                    expect(response.status).toBe(400)
                    const result = await response.json()
                    // expect(result.message[0])

        })
    })
    // verify the email
    describe("verify the user email",()=>{
        // failure case
        it("failure case",async()=>{
        mockrequest.json.mockResolvedValue({email:"venkat@gmail.com",password:"Spm@1234"})
        mockedDecryptData.mockResolvedValue("Spm@1234")
        mockedusermodel.findOne.mockResolvedValue(null)
        const response = await POST(mockrequest as unknown as NextRequest)
         expect(mockedusermodel.findOne).toHaveBeenCalledWith({email:"venkat@gmail.com"})
        expect(response.status).toBe(401)
        const result = await response.json()
        expect(result.message).toBe("Incorrect email")

    })
    // success case
    it("success case",async()=>{
        mockrequest.json.mockResolvedValue({email:"venkat@gamil.com",password:"Spm@1234"})
        mockedDecryptData.mockResolvedValue("Spm@1234")
        mockedusermodel.findOne.mockResolvedValue({email:"venkat@gamil.com",password:"Spm@1234"})
        mockedbcrypt.compare.mockResolvedValue("Spm@1234" as never)
        const response = await POST(mockrequest as unknown as NextRequest)
        expect(mockedusermodel.findOne).toHaveBeenCalledWith({email:"venkat@gmail.com"})
        expect(response.status).toBe(200)
        const result = await response.json()
        expect (result.message).toBe("Loggedin Successfully") 
    })

    })
    // unexpected error
    it("should check the unexpected error",async()=>{
        mockrequest.json.mockRejectedValue(new Error("unexpected error"))
        const response = await POST(mockrequest as unknown as NextRequest)
        expect(response.status).toBe(500)
        const result = await response.json()
        expect(result.message).toBe("Internal Server Error")
    })
})