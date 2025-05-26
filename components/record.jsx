import { toast } from "sonner"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { handleRequest } from "@/lib/http/request"
import { readFileAsJson } from "@/lib/file"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp, FileDown, Trash2 } from "lucide-react"

export function ExportRecord() {
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

export function ImportRecord() {
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
        {t("btn.import")}
      </Button>
    </>
  )
}

export function ImportNx() {
  const { t } = useTranslation()
  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState("")
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
      setSelectedUserId(fileData.data.users[0].id)
      setOpen(true)
    } else {
      toast.error(t("toast.read_error"))
    }
  }

  const handleImport = async () => {
    const result = await handleRequest("POST", `${API.IMPORT_NX}?userId=${selectedUserId}`, jsonData.data)
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
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                  <span className="text-xs text-muted-foreground">({user.id})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("btn.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleImport} disabled={!selectedUserId}>
              {t("btn.import")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function DeleteRecord() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const handleDelete = async () => {
    const result = await handleRequest("DELETE", API.DELETE_ALL)
    if (result.ok) {
      toast(t("toast.delete_success", { count: result.data.count }))
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <>
      <Button variant="outline" className="hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive" onClick={() => setOpen(true)}>
        <Trash2 />
        {t("btn.delete")}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.record.delete")}</AlertDialogTitle>
            <AlertDialogDescription>{t("settings.record.delete_confirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="text"
            className="w-full mb-2"
            placeholder="DELETE"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>{t("btn.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteConfirmText !== "DELETE"}>
              {t("btn.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
