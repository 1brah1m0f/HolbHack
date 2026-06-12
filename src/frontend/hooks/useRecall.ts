'use client';

import { useState } from 'react';
import { ErrorResponse, RecallRequest, RecallResponse } from '@/shared/types';

interface UseRecallResult {
  recall: (request: RecallRequest) => Promise<void>;
  data: RecallResponse['data'] | null;
  loading: boolean;
  error: string | null;
  startTime: number | null;
}

export function useRecall(): UseRecallResult {
  const [data, setData] = useState<RecallResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const recall = async (request: RecallRequest) => {
    setLoading(true);
    setError(null);
    setStartTime(Date.now());

    try {
      const response = await fetch('http://127.0.0.1:8000/api/recall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result: RecallResponse | ErrorResponse = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error.message);
      }
    } catch {
      setError('Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
      setStartTime(null);
    }
  };

  return { recall, data, loading, error, startTime };
}
