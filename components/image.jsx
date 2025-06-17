import NextImage from "next/image"
import { cn } from "@/lib/utils"

export function Image({ src, alt, className }) {
  return (
    <div className={cn("overflow-hidden bg-muted relative shrink-0", className)}>
      {src && (
        <NextImage
          src={src}
          alt={alt}
          fill={true}
          priority={true}
          draggable={false}
          className="object-cover"
          onError={(e) => {
            e.target.style.opacity = 0
          }}
        />
      )}
    </div>
  )
}

export function Logo({ className }) {
  return (
    <div className={cn("overflow-hidden relative shrink-0", className)}>
      <NextImage
        src="/logo.svg"
        alt="ゲーム時計"
        fill={true}
        priority={true}
        draggable={false}
        className="object-contain"
      />
    </div>
  )
}
