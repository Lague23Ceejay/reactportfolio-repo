import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // send to your logging endpoint if you have one
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-900 text-zinc-100">
          <div className="max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm opacity-80 mb-4">Reload the page or try again later.</p>
            <button onClick={() => location.reload()} className="px-4 py-2 rounded bg-emerald-500 text-white">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
