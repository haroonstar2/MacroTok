import { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1504382262782-5b4ece78642b?w=1200&q=80",
  "https://images.unsplash.com/photo-1659821637334-d0a4e521ef4a?w=1200&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
  "https://images.unsplash.com/photo-1668665771959-b217076ddde3?w=1200&q=80",
  "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=1200&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80"
];

export function HeroImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative w-full h-[600px]">
        <img
          src={images[currentIndex]}
          alt="Meal planning showcase"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
