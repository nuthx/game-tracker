import { toast } from "sonner"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { handleRequest } from "@/lib/http/request"
import { readFileAsJson } from "@/lib/json"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileUp } from "lucide-react"

export function NsSettings() {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.ns.import")}</Label>
        <CardDescription className="mb-3">{t("settings.ns.import_desc")}</CardDescription>
        <AddNs />
      </div>
    </>
  )
}

export function AddNs() {
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
      toast.error(t("toast.invalid_json"))
      return
    }

    if (fileData.data.users && fileData.data.users.length > 0) {
      setJsonData(fileData)
      setUsers(fileData.data.users)
      setSelectedUserId(fileData.data.users[0].id)
      setIsFileSelected(true)
    } else {
      toast.error(t("toast.invalid_json"))
    }
  }

  const handleImport = async () => {
    const result = await handleRequest("POST", `${API.ADD_NS}?userId=${selectedUserId}`, jsonData.data)
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
