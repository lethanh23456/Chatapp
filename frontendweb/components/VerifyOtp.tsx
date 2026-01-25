"use client";

import axios from "axios";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useAppData } from "@/context/AppContext";
import Loading from "./Loading";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const {isAuth , setIsAuth , setUser , loading : userLoading , fetchChats ,
    fetchUsers
  } = useAppData()
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(5);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();
  const email = useSearchParams().get("email") || "";

  
  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

 
  const onChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp];
    n[i] = v;
    setOtp(n);
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return alert("Nhập đủ OTP");

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/verify",
        { email, otp: code }
      );
      toast.success(data.message);
      Cookies.set("token", data.token, { expires: 15, path: "/" });
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetchUsers();
    } catch {
      alert("OTP sai");
    } finally {
      setLoading(false);
    }
  };

  if(userLoading) return <Loading/>

  if(isAuth) redirect("chat")

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submit}
        className="w-80 p-6 border rounded-xl space-y-4"
      >
        <h2 className="text-center text-lg font-semibold">
          Xác nhận OTP
        </h2>

        <div className="flex justify-between">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputRefs.current[i] = el;
              }}
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              maxLength={1}
              className="w-11 h-11 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full h-10 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Đang xác nhận..." : "Xác nhận"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {timer > 0 ? `Gửi lại sau ${timer}s` : "Hết thời gian"}
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
