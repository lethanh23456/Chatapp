"use client"
import Loading from "@/components/Loading";
import { useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import React, { use, useReducer, useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
    const[email,setEmail] = useState<string>("");
    const [loading , setLoading] = useState<boolean>(false);
    const router = useRouter();

    const {isAuth , loading : userLoading} = useAppData()

    const handleSubmit = async (
        e: React.FormEvent<HTMLElement>
    ): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        try {
            const {data} = await axios.post(`http://localhost:5000/api/v1/login`, {
                email,
            })

            toast.success(data.message)
            router.push(`/verify?email=${email}`)
        } catch (error : any){
            toast.error(error.response.data.message)
        }
    }
    if(userLoading) return <Loading/>
    if(isAuth) redirect("/chat");
  return (
    <div>
        <div>welcome to chatapp</div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label 
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2">
                    email address
                </label>
                <input
                 type="email"
                 id="email"
                 className="w-full px-4 py-4"
                 value={email}
                 onChange={e => setEmail(e.target.value)} />
            </div>
            <button type = "submit">
                <div><span>send verification code</span></div>
            </button>
        </form>
    </div>
  )
}

export default LoginPage ;