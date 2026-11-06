import Image from "next/image";
import type { ImageSource, ThemedSources } from "@/lib/screens";

type ThemedImageProps = {
  light: string;
  dark: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sources?: ThemedSources;
  sizes?: string;
  className?: string;
};

type VariantProps = Omit<ThemedImageProps, "light" | "dark" | "sources"> & {
  src: string;
  sources?: readonly ImageSource[];
  visibility: string;
};

function ThemeVariant({ src, alt, sources, sizes, visibility, className = "", priority, ...image }: VariantProps) {
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  if (!sources) {
    return <Image src={src} alt={alt} loading={loading} fetchPriority={fetchPriority} className={`${visibility} ${className}`.trim()} {...image} />;
  }

  return (
    <picture className={visibility}>
      {sources.map(({ type, srcSet }) => (
        <source key={type} type={type} srcSet={srcSet} sizes={sizes} />
      ))}
      <Image src={src} alt={alt} loading={loading} fetchPriority={fetchPriority} className={className} {...image} />
    </picture>
  );
}

export function ThemedImage({ light, dark, sources, ...image }: ThemedImageProps) {
  return (
    <span className="contents">
      <ThemeVariant src={light} sources={sources?.light} visibility="dark:hidden" {...image} />
      <ThemeVariant src={dark} sources={sources?.dark} visibility="hidden dark:block" {...image} />
    </span>
  );
}
