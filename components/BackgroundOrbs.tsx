export default function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary-400/[0.04] dark:bg-primary-400/[0.06] rounded-full blur-[120px] animate-drift" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-accent-400/[0.03] dark:bg-accent-400/[0.05] rounded-full blur-[100px] animate-drift-reverse" />
      <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] bg-primary-500/[0.02] dark:bg-primary-500/[0.04] rounded-full blur-[80px] animate-drift" style={{ animationDelay: '5s' }} />
    </div>
  )
}
