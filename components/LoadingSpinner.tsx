export default function LoadingSpinner() {
  return (
    <div className="relative">
      <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin glow" />
      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-accent-500 rounded-full animate-spin animate-spin-reverse" />
    </div>
  )
}
