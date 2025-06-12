import { useTranslation } from "react-i18next"
import { FormInput } from "@/components/form"
import { CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountSettings({ configData }) {
  const { t } = useTranslation()

  // 获取 cookie 的过期时间
  const getCookieExpiry = () => {
    const cookies = document.cookie.split(";")
    const tktkCookie = cookies.find((cookie) => cookie.trim().startsWith("tktk="))
    try {
      const token = tktkCookie.split("=")[1]
      const payload = JSON.parse(atob(token.split(".")[1]))
      return new Date(payload.exp * 1000)
    } catch {
      return null
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.account.username")}</Label>
        <CardDescription>{t("settings.account.username_desc")}</CardDescription>
        <FormInput name="username" schema="username" defaultValue={configData.username} placeholder={configData.username} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.account.password")}</Label>
        <CardDescription>{t("settings.account.password_desc")}</CardDescription>
        <FormInput name="password" schema="password" placeholder={t("settings.account.password_new")} clean={true} />
      </div>
      {getCookieExpiry() && (
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.account.expiry")}</Label>
          <CardDescription>{t("settings.account.expiry_desc")}</CardDescription>
          <Input value={getCookieExpiry().toLocaleString()} disabled />
        </div>
      )}
    </>
  )
}
