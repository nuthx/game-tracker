"use client"

import { toast } from "sonner"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/swr"
import { handleRequest } from "@/lib/http"
import { readFileAsJson } from "@/lib/file"
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
    if (result) {
      toast(t("toast.import_success", { success: result.data.success, skipped: result.data.skipped, failed: result.data.failed }))
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
    
    const result = await handleRequest("POST", API.IMPORT_NX, jsonData.data)
    if (result) {
      toast(t("toast.import_success", { success: result.data.success, skipped: result.data.skipped, failed: result.data.failed }))
    }
  }

  return (
    <>
      <Input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
      <Button variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
        <FileUp />
        {t("settings.record.import_nx")}
      </Button>
    </>
  )
}
