import Image from "next/image"

export function Avatar({ src, alt, title, subtitle }) {
  return (
    <div className="flex gap-3 md:gap-4 items-center border rounded-lg shadow-xs p-3 md:p-4 flex-1 w-full">
      <Image
        src={src}
        alt={alt}
        className="rounded-full size-10 md:size-14 object-cover shrink-0"
        width={56}
        height={56}
        priority
        draggable="false"
      />
      <div className="flex flex-col gap-0 md:gap-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
