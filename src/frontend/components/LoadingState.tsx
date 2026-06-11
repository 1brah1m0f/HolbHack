'use client';

import { useEffect, useState } from 'react';

interface LoadingStateProps {
  startTime?: number;
}

export function LoadingState({ startTime }: LoadingStateProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - (startTime || Date.now()));
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  const messages = [
    'Analyzing your memories...',
    'The AI is reading your game lore...',
    'Almost there, piecing together your journey...',
  ];

  const messageIndex = Math.min(Math.floor(elapsed / 2000), messages.length - 1);
  const message = elapsed > 10000 ? 'Taking longer than expected... bear with us!' : messages[messageIndex];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}
