import React from 'react'

type State = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console so dev server shows the stack trace
    // eslint-disable-next-line no-console
    console.error('Uncaught error in React tree:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-lg p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Application error</h2>
            <pre className="text-xs text-red-600 whitespace-pre-wrap">{String(this.state.error)}</pre>
            <p className="mt-4 text-sm text-gray-600">Check the dev server console for a full stack trace.</p>
          </div>
        </div>
      )
    }

    return this.props.children as React.ReactElement
  }
}
