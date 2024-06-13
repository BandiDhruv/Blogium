import { Layout } from "../components/Layout/layout"
import { User, useGetUser } from "../hooks"
import { LabelledInput } from "../components/Auth"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { TextEditors } from "./Publish"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"


export const Profile = () => {

    const { user } = useGetUser()
    const [userData, setUserData] = useState<User>(user || {} as User)
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user?.id.toString() || '');
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/upload-profilePhoto`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUserData(response.data.user);
            alert("Profile Picture Updated SuccessFully")
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        setUserData(user as User)
    }, [user])
    
    const navigate = useNavigate();
    
    async function handleUpdate(e: React.MouseEvent<HTMLButtonElement>, userDatas: User) {
        e.preventDefault();
        console.log(userDatas);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/update-user`, userDatas)
            // console.log(response);
            if (response.status === 200) {
                alert('Information Updated Succesfully!');
                navigate('/blogs')
            }
        }
        catch (e) {
            alert("Could Not Update Details");
        }
    }
    // console.log(userData)
    return <>
        <Layout>
            <div className="h-full flex flex-col justify-start items-center p-5 bg-stone-100">
                {/* <div className="flex flex-row h-[150px] justify-start items-center border-b w-full bg-red-400"> */}
                    <form onSubmit={handleSubmit} className="flex items-center justify-start w-full">
                        <input type="file" name="file" id="profile" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="profile" className="cursor-pointer">
                            {userData?.ProfilePic?  (
                                <img
                                    src={userData.ProfilePic}
                                    alt="Profile"
                                    style={{ height: '10rem', width: '10rem' }}

                                    className="bg-white rounded-full flex items-center justify-center"
                                />
                            ) : (
                                <div className="relative inline-flex items-center justify-center w-28 h-28 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600">
                                    <span className="font-extrabold text-6xl text-gray-500">
                                        {userData && userData.name && userData.name[0].toUpperCase() || "A"}
                                    </span>
                                </div>
                            )}
                        </label>
                        <button type="submit" className=" ml-3 text-white bg-green-700 hover:bg-green-800 font-medium rounded-full text-sm px-3 py-1.5 text-center">
                            Update
                        </button>
                    </form>
                {/* </div> */}
                <div className="flex flex-row justify-around w-full">
                    <LabelledInput
                        defaultV={user?.email}
                        label="Email:"
                        placeholder="Your Email..."
                        onChange={(e) => {
                            setUserData((c) => ({
                                ...c,
                                email: e.target.value,
                            }))
                        }}
                    />
                    <LabelledInput
                        defaultV={user?.name}
                        label="Name:"
                        placeholder="Your Name..."
                        onChange={(e) => {
                            setUserData((c) => ({
                                ...c,
                                name: e.target.value,
                            }))
                        }}
                    />
                </div>
                <div className="flex flex-row justify-center w-full">
                    <TextEditors
                        defaultV={user?.catchPhrase}
                        rows={8}
                        cols={80}
                        label="CatchPhrase: (Please be detail in CatchPhrase (more than 50 characters) or it won't be shown)"
                        placeholder="Your CatchPhrase..."
                        onChange={(e) => {
                            setUserData((c) => ({
                                ...c,
                                catchPhrase: e.target.value,
                            }))
                        }}
                    />
                </div>
                <div className="flex flex-row justify-center w-full">
                    <LabelledInput
                        defaultV={user?.password}
                        label="Password:"
                        placeholder="Your Password..."
                        onChange={(e) => {
                            setUserData((c) => ({
                                ...c,
                                password: e.target.value,
                            }))
                        }}
                        type="password"
                        eye={true}
                    />
                </div>
                <button className="mt-4 inline-flex items-center justify-center h-10 w-[100px] text-sm  text-center text-white bg-blue-700 rounded-lg  hover:bg-blue-800" onClick={(e) => handleUpdate(e, userData)}>Update</button>
            </div>
        </Layout>
    </>
}