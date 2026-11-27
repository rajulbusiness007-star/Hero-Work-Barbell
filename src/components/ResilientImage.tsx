import { useEffect, useRef, useState } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(eager);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setHasError(false);
    if (eager) {
      setIsLoaded(true);
      return;
    }
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src, eager]);

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
      ref={imgRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={fetchPriority}
      decoding={eager ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      data-loaded={isLoaded ? 'true' : 'false'}
      data-animate={eager ? 'false' : 'true'}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      className={`resilient-img ${className}`}
    />
  );
}
