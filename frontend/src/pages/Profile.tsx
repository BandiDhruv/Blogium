import { Layout } from "../components/Layout/layout"
import { User, useGetUser } from "../hooks"
import { LabelledInput } from "../components/Auth"
import { useEffect, useState } from "react"
import { TextEditor } from "./Publish"


export const Profile = () =>{

    const {user}= useGetUser()
    const [userData,setUserData]=useState<User>(user || {}as User)
    useEffect(()=>{
        setUserData(user as User)
    },[user])

    return <>
        <Layout>
            <div className="h-full flex flex-col justify-start items-center p-5 bg-stone-100">
                <div className="border-b w-full">IMAGE KA DAALNA HAI YAHA</div>
                <div className="flex flex-row justify-around w-full">
                    <LabelledInput
                        defaultV={user?.email}
                        label="Email:"
                        placeholder="Your Email..."
                        onChange={(e)=>{setUserData((c)=>({
                            ...c,
                            email:e.target.value,
                        }))}}
                        />
                    <LabelledInput
                        defaultV={user?.name}
                        label="Name:"
                        placeholder="Your Name..."
                        onChange={(e)=>{setUserData((c)=>({
                            ...c,
                            name:e.target.value,
                        }))}}
                        />
                </div>
                <div className="flex flex-row justify-center w-full">
                    <TextEditor
                        defaultV={"jisdada"}
                        rows={8}
                        cols={80}
                        label="CatchPhrase:"
                        placeholder="Your CatchPhrase..."                   
                        onChange={(e)=>{console.log(e.target.value)}}
                        />
                </div>
                <div className="flex flex-row justify-center w-full">
                    <LabelledInput
                        defaultV={user?.password}
                        label="Password:"
                        placeholder="Your Password..."
                        onChange={(e)=>{setUserData((c)=>({
                            ...c,
                            password:e.target.value,
                        }))}}
                        type="password"
                        eye={true}
                        />
                </div>
                <button className="mt-4 inline-flex items-center justify-center h-10 w-[100px] text-sm  text-center text-white bg-blue-700 rounded-lg  hover:bg-blue-800" onClick={()=>{console.log(userData)}}>Update</button>
            </div>
        </Layout>
    </> 
}