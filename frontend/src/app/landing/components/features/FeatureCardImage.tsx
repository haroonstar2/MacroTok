export function FeatureCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-64 object-cover rounded-lg"
    />
  );
}
