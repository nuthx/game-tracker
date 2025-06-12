import { toast } from "sonner"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { handleRequest } from "@/lib/http/request"
import { readFileAsJson } from "@/lib/file"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
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
    const result = await handleRequest("GET", API.BACKUP)
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

    const result = await handleRequest("POST", API.RESTORE, jsonData.data)
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

export function DeleteRecord() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const handleDelete = async () => {
    const result = await handleRequest("DELETE", API.REMOVE)
    if (result.ok) {
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

export function ImportNxRecord() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [jsonData, setJsonData] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isFileSelected, setIsFileSelected] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file || !file.name.endsWith(".json")) {
      toast.error(t("toast.invalid_file"))
      return
    }

    await processFile(file)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ""
    await processFile(file)
  }

  const processFile = async (file) => {
    const fileData = await readFileAsJson(file)
    if (!fileData.ok) {
      toast.error(t("toast.read_error"))
      return
    }

    if (fileData.data.users && fileData.data.users.length > 0) {
      setJsonData(fileData)
      setUsers(fileData.data.users)
      setSelectedUserId(fileData.data.users[0].id)
      setIsFileSelected(true)
    } else {
      toast.error(t("toast.read_error"))
    }
  }

  const handleImport = async () => {
    const result = await handleRequest("POST", `${API.IMPORT_NS}?userId=${selectedUserId}`, jsonData.data)
    if (result.ok) {
      toast(t("toast.import_success", { success: result.data.success, skipped: result.data.skipped, failed: result.data.failed }))
      setIsFileSelected(false)
      setSelectedUserId("")
      setJsonData(null)
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex flex-col items-center gap-4 justify-center border-2 border-dashed rounded-lg px-6 py-12 cursor-pointer transition-all hover:border-primary/30 hover:bg-muted/50 ${isDragging && "border-primary/30 bg-muted/50"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
        onClick={() => document.getElementById("file-upload").click()}
      >
        <FileUp className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("settings.ns.drag_hint")}</p>
        <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleFileSelect} />
      </div>

      {isFileSelected && (
        <div className="flex gap-1.5">
          <Select value={selectedUserId} onValueChange={setSelectedUserId} className="flex-1">
            <SelectTrigger className="w-full">
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
          <Button onClick={handleImport} disabled={!selectedUserId}>
            {t("btn.import")}
          </Button>
        </div>
      )}
    </div>
  )
}
