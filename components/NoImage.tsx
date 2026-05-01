import Image from 'next/image'

interface NoImageProps {
  label?: string
  priority?: boolean
}

export default function NoImage({ label = 'No image on file', priority = false }: NoImageProps) {
  return (
    <div className="absolute inset-0 bg-paper-100 dark:bg-paper-900 flex flex-col items-center justify-center">
      <div className="relative w-[68%] h-[72%] opacity-55 dark:opacity-45">
        <Image
          src="/images/no-image-shisha.png"
          alt=""
          fill
          priority={priority}
          className="object-contain dark:invert"
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 15vw"
        />
      </div>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono-tight text-[9px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500">
        {label}
      </span>
    </div>
  )
}
