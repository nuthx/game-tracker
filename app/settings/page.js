"use client";

import Image from "next/image"
import { toast } from "sonner"
import { useEffect } from "react";
import { useData, API } from "@/lib/swr";
import { handleRequest } from "@/lib/http";
import { createForm } from "@/lib/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  const { data: configData, error: configError, isLoading: configLoading, mutate: configMutate } = useData(API.CONFIG);

  const npssoForm = createForm({
    new_npsso: { schema: "required" },
  })();

  const monitorForm = createForm({
    new_monitorId: { schema: "required" },
  })();

  const userForm = createForm({
    new_username: { schema: "username" },
    new_password: { schema: "password" }
  })();

  useEffect(() => {
    if (configData?.username) {
      monitorForm.setValue("new_monitorId", configData.monitorId);
      userForm.setValue("new_username", configData.username);
    }
  }, [configData]);

  const handleConfig = async (values) => {
    const result = await handleRequest("PATCH", API.CONFIG, values);
    if (result) {
      configMutate();
      toast("配置已保存")
    }
  };

  if (configLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">加载中...</div>;
  }

  if (configError) {
    return <div className="flex justify-center text-sm text-muted-foreground">配置信息获取失败</div>;
  }

  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-6 flex-1">
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>PSN账号</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...npssoForm}>
              <form onSubmit={npssoForm.handleSubmit((values) => handleConfig(values))} className="space-y-6" noValidate>
                <FormField control={npssoForm.control} name="new_npsso" render={({ field }) => (
                  <FormItem>
                    <FormLabel>NPSSO</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder={configData.npsso === "****" ? "" : configData.npsso} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit">保存</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>监控设置</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...monitorForm}>
              <form onSubmit={monitorForm.handleSubmit((values) => handleConfig(values))} className="space-y-6" noValidate>
                <FormField control={monitorForm.control} name="new_monitorId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>PSNID</FormLabel>
                    <FormControl>
                      <Input className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit">保存</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>用户资料</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit((values) => handleConfig(values))} className="space-y-6" noValidate>
                <FormField control={userForm.control} name="new_username" render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={userForm.control} name="new_password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>新密码</FormLabel>
                    <FormControl>
                      <Input className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit">保存</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card className="w-80 h-fit">
        <CardContent className="flex flex-col items-center gap-4">
          <Image src="https://blog.playstation.com/tachyon/2028/04/cb6472ba78b0978c5190f3abd6897c1e1ce1eb01.png" alt="User Avatar" className="rounded-full object-cover w-30 h-30" width={120} height={120} priority draggable="false"/>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-bold">Name</p>
            <p className="text-sm text-muted-foreground">PSNID: 123456789</p>
          </div>
          <Button variant="secondary" className="mt-2 w-full shadow-none">登出系统</Button>
        </CardContent>
      </Card>
    </div>
  );
}
