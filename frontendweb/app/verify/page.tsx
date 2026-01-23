"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, Suspense } from "react";
import Cookies from "js-cookie";
import VerifyOtp from "@/components/VerifyOtp";
import Loading from "@/components/Loading";

const VerifyPage = () => {
 
  return (
    <Suspense fallback = {<Loading/>}>
      <VerifyOtp/>
    </Suspense>
  );
};

export default VerifyPage;
