import { toast } from "sonner"
import { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { handleRequest } from "@/lib/http/request"
import { readFileAsJson } from "@/lib/json"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileDown, FileUp, Trash2 } from "lucide-react"

export function DataSettings() {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.record.export")}</Label>
          <CardDescription>{t("settings.record.export_desc")}</CardDescription>
        </div>
        <Export />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.record.import")}</Label>
          <CardDescription>{t("settings.record.import_desc")}</CardDescription>
        </div>
        <Import />
      </div>
      <Separator />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.record.delete")}</Label>
          <CardDescription>{t("settings.record.delete_desc")}</CardDescription>
        </div>
        <Delete />
      </div>
    </>
  )
}

function Export() {
  const { t } = useTranslation()

  const handleExport = async () => {
    const result = await handleRequest("GET", API.EXPORT)
    if (result.ok) {
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "gt-export.json"
      link.click()

      URL.revokeObjectURL(url)
      toast(t("toast.export_success", { count: result.data.count.total }))
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <>
      <Button variant="outline" className="w-fit" onClick={handleExport}>
        <FileDown />
        {t("btn.export")}
      </Button>
    </>
  )
}

function Import() {
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

    const result = await handleRequest("POST", API.IMPORT, jsonData.data)
    if (result.ok) {
      if (result.data.failed === 0) {
        toast(t("toast.import_success"))
      } else {
        toast(t("toast.import_failed", {
          platform: result.data.failedResult.failedPlatform,
          game: result.data.failedResult.failedGame,
          record: result.data.failedResult.failedRecord
        }))
      }
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <>
      <Input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
      <Button variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
        <FileUp />
        {t("btn.import")}
      </Button>
    </>
  )
}

function Delete() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const handleDelete = async () => {
    const result = await handleRequest("DELETE", API.DELETE)
    if (result.ok) {
      setDeleteConfirmText("")
      setOpen(false)
      toast(t("toast.delete_success", { count: result.data.count }))
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <>
      <Button variant="outline" className="w-fit hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive" onClick={() => setOpen(true)}>
        <Trash2 />
        {t("btn.delete")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.record.delete")}</DialogTitle>
            <DialogDescription>{t("settings.record.delete_confirm")}</DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            className="w-full mb-2"
            placeholder="DELETE"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmText("")
                setOpen(false)
              }}
            >{t("btn.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteConfirmText !== "DELETE"}>
              {t("btn.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
