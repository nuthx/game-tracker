import { Button } from "@/components/ui/button"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" disabled={page === 1} onClick={() => onChange(1)}>
        <ChevronsLeft className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <span className="text-sm px-4">
        {page} / {totalPages}
      </span>

      <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onChange(totalPages)}>
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
