"use client"

import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useData, API } from "@/lib/swr"
import { handleRequest } from "@/lib/http"
import { createForm } from "@/lib/form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const [npssoLoading, setNpssoLoading] = useState(false)

  const { data: configData, error: configError, isLoading: configLoading, mutate: configMutate } = useData(API.CONFIG)

  const npssoForm = createForm({
    new_npsso: { schema: "required" }
  })()

  const monitorForm = createForm({
    new_monitorId: { schema: "required" },
    new_monitorInterval: { schema: "required" }
  })()

  const userForm = createForm({
    new_username: { schema: "username" },
    new_password: { schema: "password" }
  })()

  useEffect(() => {
    if (configData?.username) {
      monitorForm.setValue("new_monitorId", configData.monitorId)
      monitorForm.setValue("new_monitorInterval", configData.monitorInterval)
      userForm.setValue("new_username", configData.username)
    }
  }, [configData, monitorForm, userForm])

  const handleConfig = async (values) => {
    const result = await handleRequest("PATCH", API.CONFIG, values)
    if (result) {
      configMutate()
      toast(t("toast.save_config"))
    }
  }

  const handleNpssoConfig = async (values) => {
    try {
      setNpssoLoading(true)
      const result = await handleRequest("PATCH", API.CONFIG, values)
      if (result) {
        configMutate()
        toast(t("toast.save_config"))
      }
    } finally {
      setNpssoLoading(false)
    }
  }

  const handleExport = async () => {
    const result = await handleRequest("GET", API.EXPORT)
    if (result) {
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "export.json"
      link.click()

      URL.revokeObjectURL(url)
      toast(t("toast.export_success"))
    }
  }

  const handleLogout = async () => {
    const result = await handleRequest("DELETE", API.LOGOUT)
    if (result) {
      router.push("/login")
      router.refresh()
    }
  }

  if (configLoading) {
    return <></>
  }

  if (configError) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_config")}</div>
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      <Card className="md:order-last w-full md:w-60 lg:w-72 h-fit transition-all">
        <CardContent className="flex flex-col items-center gap-4">
          {configData.avatar && (
            <Image src={configData.avatar} alt="User Avatar" className="rounded-full object-cover w-30 h-30" width={120} height={120} priority draggable="false" />
          )}
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-bold">{configData.onlineId || t("settings.login_first")}</p>
            {configData.accountId && (
              <p className="text-sm text-muted-foreground">{configData.accountId}</p>
            )}
          </div>
          <Button variant="secondary" className="mt-2 w-full shadow-none" onClick={handleLogout}>{t("btn.logout")}</Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 md:gap-6 flex-1">
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>{t("settings.psn_account")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...npssoForm}>
              <form onSubmit={npssoForm.handleSubmit((values) => handleNpssoConfig(values))} className="space-y-6" noValidate>
                <FormField
                  control={npssoForm.control}
                  name="new_npsso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NPSSO</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder={configData.npsso === "****" ? "" : configData.npsso} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={npssoLoading}>{t("btn.save")}</Button>
                  {npssoLoading && <Loader2 className="size-6 animate-spin text-muted-foreground" />}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>{t("settings.monitor_settings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...monitorForm}>
              <form onSubmit={monitorForm.handleSubmit((values) => handleConfig(values))} className="space-y-6" noValidate>
                <FormField
                  control={monitorForm.control}
                  name="new_monitorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PSNID</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder={configData.monitorId} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={monitorForm.control}
                  name="new_monitorInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.monitor_interval")}</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={configData.monitorInterval}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 {t("time.seconds")}</SelectItem>
                            <SelectItem value="10">10 {t("time.seconds")}</SelectItem>
                            <SelectItem value="20">20 {t("time.seconds")}</SelectItem>
                            <SelectItem value="30">30 {t("time.seconds")}</SelectItem>
                            <SelectItem value="60">60 {t("time.seconds")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t("btn.save")}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>{t("settings.user_info")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit((values) => handleConfig(values))} className="space-y-6" noValidate>
                <FormField
                  control={userForm.control}
                  name="new_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.username")}</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder={configData.username} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.password")}</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder={t("settings.password_placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t("btn.save")}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>{t("settings.export")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport}>{t("btn.export")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
