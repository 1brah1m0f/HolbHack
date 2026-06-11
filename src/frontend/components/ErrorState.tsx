'use client';

import { Button } from './ui/Button';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryable?: boolean;
}

export function ErrorState({ error, onRetry, retryable = false }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <div className="flex items-center mb-4">
          <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900">Something went wrong</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        {retryable && onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
