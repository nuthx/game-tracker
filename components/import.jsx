"use client"

import { toast } from "sonner"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { handleRequest } from "@/lib/http/request"
import { readFileAsJson } from "@/lib/file"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp } from "lucide-react"

export function ImportGt() {
  const { t } = useTranslation()
  const fileInputRef = useRef(null)

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 重置文件选择器
    event.target.value = ""

    const jsonData = await readFileAsJson(file)
    if (!jsonData.ok) {
      toast.error(t("toast.read_error"))
      return
    }

    const result = await handleRequest("POST", API.IMPORT_GT, jsonData.data)
    if (result.ok) {
      toast(t("toast.import_success", { success: result.data.success, skipped: result.data.skipped, failed: result.data.failed }))
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <>
      <Input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
      <Button variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
        <FileUp />
        {t("settings.record.import_gt")}
      </Button>
    </>
  )
}

export function ImportNx() {
  const { t } = useTranslation()
  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [jsonData, setJsonData] = useState(null)

  const handleUserSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 重置文件选择器
    event.target.value = ""

    const fileData = await readFileAsJson(file)
    if (!fileData.ok) {
      toast.error(t("toast.read_error"))
      return
    }

    // 拉起用户选择对话框
    if (fileData.data.users && fileData.data.users.length > 0) {
      setJsonData(fileData)
      setUsers(fileData.data.users)
      setOpen(true)
    } else {
      toast.error(t("toast.read_error"))
    }
  }

  const handleImport = async (userId) => {
    const result = await handleRequest("POST", `${API.IMPORT_NX}?userId=${userId}`, jsonData.data)
    if (result.ok) {
      toast(t("toast.import_success", { success: result.data.success, skipped: result.data.skipped, failed: result.data.failed }))
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
    setOpen(false)
  }

  return (
    <>
      <Input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleUserSelect} />
      <Button variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
        <FileUp />
        {t("settings.record.import_nx")}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.record.import_nx")}</AlertDialogTitle>
            <AlertDialogDescription>{t("settings.record.import_nx_dialog")}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 mb-2">
            {users.map((user) => (
              <Button key={user.id} variant="outline" onClick={() => handleImport(user.id)}>
                {user.name}
                <span className="text-xs text-muted-foreground">({user.id})</span>
              </Button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("btn.cancel")}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
