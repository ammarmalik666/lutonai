import React from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <h2 className="mb-4 text-2xl font-bold">Something went wrong</h2>
          <p className="mb-4 text-muted-foreground">
            We apologize for the inconvenience. Please try again later.
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 