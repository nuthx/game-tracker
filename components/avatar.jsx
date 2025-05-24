import Image from "next/image"

export function Avatar({ src, alt, title, subtitle }) {
  return (
    <div className="flex gap-4 items-center border rounded-lg shadow-xs p-4 flex-1">
      <Image
        src={src}
        alt={alt}
        className="rounded-full size-14 object-cover shrink-0"
        width={56}
        height={56}
        priority
        draggable="false"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
