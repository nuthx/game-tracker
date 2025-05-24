import { toast } from "sonner"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { handleRequest } from "@/lib/http/request"
import { createForm } from "@/lib/form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function FormInput({ name, schema = "required", defaultValue = "", placeholder }) {
  const { t } = useTranslation()
  const userForm = createForm({ [name]: { schema: schema } })()
  const currentValue = userForm.watch(name)
  const isDirty = currentValue !== defaultValue

  useEffect(() => {
    userForm.setValue(name, defaultValue)
  }, [userForm, name, defaultValue])

  const handleSubmit = async (values) => {
    const result = await handleRequest("PATCH", API.CONFIG, values)
    if (result.ok) {
      toast(t("toast.save_config"))
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <Form {...userForm}>
      <form onSubmit={userForm.handleSubmit((values) => handleSubmit(values))} className="flex gap-1.5" noValidate>
        <FormField
          control={userForm.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex-1 gap-1">
              <FormControl>
                <Input placeholder={placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isDirty && <Button type="submit">{t("btn.save")}</Button>}
      </form>
    </Form>
  )
}

export function FormSelect({ name, defaultValue, options }) {
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    const result = await handleRequest("PATCH", API.CONFIG, values)
    if (result.ok) {
      toast(t("toast.save_config"))
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  return (
    <Select onValueChange={(value) => handleSubmit({ [name]: value })} defaultValue={defaultValue}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
