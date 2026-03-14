export default function LoadingSpinner() {
  return (
    <div className="relative">
      <div className="w-16 h-16 border-2 border-primary-200/30 dark:border-primary-700/30 border-t-primary-500 dark:border-t-primary-400 rounded-full animate-spin" />
      <div className="absolute inset-2 border-2 border-transparent border-b-accent-400/50 rounded-full animate-spin animate-spin-reverse" />
    </div>
  )
}
