"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useReducer, useState } from "react";

const LoginPage = () => {
    const[email,setEmail] = useState<string>("");
    const [loading , setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (
        e: React.FormEvent<HTMLElement>
    ): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        try {
            const {data} = await axios.post(`http://localhost:5000/api/v1/login`, {
                email,
            })

            alert(data.message)
            router.push(`/verify?email=${email}`)
        } catch (error : any){
            alert(error.response.data.message)
        }
    }
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