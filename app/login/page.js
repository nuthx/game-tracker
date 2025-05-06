"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { API } from "@/lib/swr";
import { handleRequest } from "@/lib/http";
import { createForm } from "@/lib/form";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const router = useRouter();
  const { t } = useTranslation();

  const loginForm = createForm({
    username: { schema: "required" },
    password: { schema: "required" }
  })();

  const handleLogin = async (values) => {
    const result = await handleRequest("POST", API.LOGIN, values);
    if (result) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <Card className="w-100">
        <CardContent className="flex flex-col items-center gap-10">
          <p className="text-xl font-bold mt-2">ゲーム時計</p>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit((values) => handleLogin(values))} className="w-full space-y-6" noValidate>
              <FormField control={loginForm.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("login.username")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={loginForm.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("login.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full mt-2">{t("btn.login")}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
