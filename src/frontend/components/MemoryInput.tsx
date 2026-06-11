'use client';

import { TextArea } from './ui/TextArea';

interface MemoryInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function MemoryInput({ value, onChange, error }: MemoryInputProps) {
  return (
    <TextArea
      label="Describe What You Remember"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      placeholder="I remember fighting a dragon at a castle, and I met a witch who gave me a potion..."
      rows={6}
      maxLength={2000}
    />
  );
}
