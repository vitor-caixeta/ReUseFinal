// components/SmartImage.tsx
import Image from "next/image";

const allowedHosts = new Set([
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
]);

export default function SmartImage({
  src,
  alt,
  className,
  fill = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}) {
  try {
    const { host } = new URL(src);
    if (allowedHosts.has(host)) {
      return fill ? (
        <Image src={src} alt={alt} fill className={className} />
      ) : (
        <Image src={src} alt={alt} width={400} height={400} className={className} />
      );
    }
  } catch {

}
  return <img src={src} alt={alt} className={className} />;
}
