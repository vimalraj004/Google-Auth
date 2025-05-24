import { GET } from "@/app/api/user/me/route";
import { NextRequest } from "next/server";
import { describe } from "node:test";
import * as helper from "@/helpers/page"
import * as middleware from "@/serverSideMiddleware"

const createMockRequest = ()=> new NextRequest (new Request ("http://localhost:3000/api/user/me/route"))
describe("userdeatils",()=>{
      beforeEach(()=>{
        jest.clearAllMocks()
    })
        it("should check the userdata success case",async ()=>{
        const mockData = {email:"venkat@gmail.com",password:"Spm@1234"}
        jest.spyOn(helper,"getDataFromToken").mockResolvedValue(mockData)
        jest.spyOn(middleware,"withAuth").mockImplementation((handler)=> handler)
        const req = createMockRequest()
        const response = await GET(req)
        expect(response.status).toBe(200)
        const result = await response.json()
        expect(result.message).toBe("successfully fetched the data")

    })
})
  


