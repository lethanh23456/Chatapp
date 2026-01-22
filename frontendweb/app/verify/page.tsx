"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";

const VerifyPage = () => {
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
      Cookies.set("token", data.token, { expires: 15, path: "/" });
      router.push("/");
    } catch {
      alert("OTP sai");
    } finally {
      setLoading(false);
    }
  };

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

export default VerifyPage;
