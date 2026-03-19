import { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1586105251261-72a756497a11",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
];

function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullView, setFullView] = useState(null);
  const [fade, setFade] = useState(true);

  // 🔥 AUTO SLIDE WITH SMOOTH FADE
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true); // fade in
      }, 300); // timing of fade out
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const selectedImg = images[currentIndex];

  return (
    <div className="py-12 px-4 bg-white">

      <h2 className="text-2xl font-bold text-center mb-8 text-[#2C4549]">
        Our PG Gallery
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT BIG IMAGE */}
        <div>
          <img
            src={selectedImg}
            onClick={() => setFullView(selectedImg)}
            className={`w-full h-80 object-cover rounded-2xl cursor-pointer transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* RIGHT THUMBNAILS */}
        <div className="h-80 overflow-y-auto space-y-4 pr-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setFade(true);
                }, 200);
              }}
              className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition ${
                currentIndex === index
                  ? "border-[#2C4549]"
                  : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* FULL SCREEN */}
      {fullView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setFullView(null)}
        >
          <img
            src={fullView}
            className="max-h-[90%] max-w-[90%] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

export default Gallery;