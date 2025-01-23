"use client";
import { Appbar } from "@/src/components/Appbar";
import { CheckFeature } from "@/src/components/CheckFeature";
import { Input } from "@/src/components/Input";
import { PrimaryButton } from "@/src/components/button/primarybutton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function() {
    const [otp, setotp] = useState("");
    const router = useRouter(); 
    return <div> 
        <Appbar />
        <div className="flex justify-center">
            <div className="flex pt-8 max-w-4xl">
                <div className="flex-1 pt-20 px-4">
                    <div className="font-semibold text-3xl pb-4">
                    Join millions worldwide who automate their work using Zapier.
                    </div>
                    <div className="pb-6 pt-4">
                        <CheckFeature label={"Easy setup, no coding required"} />
                    </div>
                    <div className="pb-6">
                        <CheckFeature label={"Free forever for core features"} />
                    </div>
                    <CheckFeature label={"14-day trial of premium features & apps"} />

                </div>
                <div className="flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
                    <Input onChange={e => {
                        setotp(e.target.value)
                    }} label={"OTP"} type="text" placeholder="Your Email"></Input>
                    <div className="pt-4">
                        <PrimaryButton onClick={async () => {
                            const response=localStorage.getItem("User");
                            const res = await axios.post(`${BACKEND_URL}/v1/auth/verify_otp`, {
                                otp,
                                response
                            });
                            localStorage.removeItem("User");
                            localStorage.setItem("token", res.data.token);
                            router.push("/dashboard");
                        }} size="big">Login</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
}