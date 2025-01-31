"use server";

import { api } from "@/lib/api";
import { verifyLoginSchema, verifyLoginResponseSchema } from "@/lib/zod";
import { z } from "zod";

export async function getOtp(email: string) {
  try {
    const response = await api(z.any(), {
      url: "/login/send",
      method: "post",
      data: { email },
    });

    console.log(response);

    return response;
  } catch (error) {
    console.error("Error requesting login otp", error);
    return {
      status: false,
      message: "Error",
      data: null,
    };
  }
}

export async function login(data: z.infer<typeof verifyLoginSchema>) {
  try {
    const response = await api(verifyLoginResponseSchema, {
      url: "/login/verify",
      method: "post",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error requesting login otp", error);
    return {
      status: false,
      message: "Error",
      data: null,
    };
  }
}
