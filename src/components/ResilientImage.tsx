import { useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  eager?: boolean;
  fetchPriority?: 'high' | 'low';
  width?: number;
  height?: number;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
  eager = false,
  fetchPriority,
  width,
  height,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-[#121216] to-zinc-950 text-zinc-500 border border-zinc-800 ${className}`}
      >
        <Dumbbell className="w-7 h-7 text-[#C8FF00]/70 mb-2" aria-hidden="true" />
        {fallbackLabel && (
          <span className="text-xs font-medium tracking-wide text-zinc-400 px-3 text-center">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={fetchPriority}
      decoding={eager ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
