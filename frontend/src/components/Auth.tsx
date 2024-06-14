import { SignupInput } from "@dhruvbandi/blogium-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { BsEye } from "react-icons/bs";
import axios from "axios";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: "",
    });
    const navigate=useNavigate();
    async function sendRequest(){
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`,postInputs)
            const jwt=response.data.token;
            localStorage.setItem("token",JSON.stringify(jwt));
            navigate("/blogs")
        }catch(e){
            alert("error while signing up")
        }
    }
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center items-center">
                <div className="">
                    <div className="px-10 py-5 flex flex-col items-center">
                        <div className="text-3xl font-extrabold">{type==="signup"?"Create an account ":"Sign in to your Account"}</div>
                        <div className="text-base text-slate-400">
                            {type==="signup"?"Already have an account?" : "Don't have an account?"}
                            <Link className="pl-2 underline" to={type==="signup"? "/signin":"/signup"}>
                                {type==="signup"?"SignIn":"SignUp"}
                            </Link>
                        </div>
                    </div>
                    <div>
                        {type==="signup" && 
                        <LabelledInput
                            label="Name"
                            placeholder="Your Name..."
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    name: e.target.value,
                                }));
                            }}
                        />}
                        <LabelledInput
                            label="Email"
                            placeholder="Your Email..."
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    email: e.target.value,
                                }));
                            }}
                        />
                        <LabelledInput
                            label="Password"
                            type={"password"}
                            placeholder="Your Password..."
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    password: e.target.value,
                                }));
                            }}
                        />
                        <button onClick= {sendRequest} type="button" className="mt-2.5 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type==="signup" ? "SignUp":"SignIn"}</button>

                    </div>
                </div>
            </div>
        </div>
    );
};
export interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    defaultV?: string;
    eye?: boolean;
    but?: boolean;
    onClick?: () => void;
}

export function LabelledInput({
    label,
    placeholder,
    onChange,
    type,
    defaultV = "",
    eye = false,
    but = false,
    onClick,
}: LabelledInputType) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-black">
                {label}
            </label>
            <div className="flex relative items-center">
                <input
                    id={label}
                    onChange={onChange}
                    defaultValue={defaultV}
                    type={type || "text"}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2.5"
                    placeholder={placeholder}
                    required
                />
                {eye && <BsEye className="absolute right-2 top-3 cursor-pointer" onClick={() => {
                    var x = document.getElementById("Password:");
                    if (x?.getAttribute("type") === "password") {
                        x.setAttribute("type", "text");
                    } else {
                        x?.setAttribute("type", "password");
                    }
                }} />}
                {but && <button onClick={onClick} className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-[1rem] text-sm px-5 text-center mx-2 mb-2.5 cursor-pointer w-[5rem] h-[2rem]">Add</button>}
            </div>
        </div>
    );
}