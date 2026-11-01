import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Top-level Error Boundary fallback for catching React render failures gracefully
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-6 text-center text-[#262D20]">
          <div className="w-16 h-16 rounded-2xl bg-[#8B9A6E]/15 text-[#55603F] flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#8B9A6E]" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something unexpected happened</h2>
          <p className="text-xs text-[#6B785E] max-w-md mb-6">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-[#8B9A6E] text-white text-sm font-bold shadow-md cursor-pointer hover:bg-[#5B7147] transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
