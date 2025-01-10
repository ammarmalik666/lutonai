export function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-xl border bg-card p-6">
      <LoadingSpinner />
    </div>
  )
} 