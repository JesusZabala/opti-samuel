import { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

import slide1 from "@/assets/intro.jpg";
import slide2 from "@/assets/MonturaNEW.png";
import slide3 from "@/assets/VisualEx.jpg";
import slide4 from "@/assets/fondo.jpg";

interface LandingWelcomeProps {
  onEnterLogin: () => void;
}

const slides = [
  {
    image: slide1,
    title: "Satisfaccion con nuestros clientes",
    subtitle: "Nuestra mision es cuidar tu visión",
  },
  {
    image: slide2,
    title: "Monturas de Alta Calidad",
    subtitle: "Diseños modernos para cada estilo",
  },
  {
    image: slide3,
    title: "Exámenes Visuales de Precisión",
    subtitle: "Diagnóstico profesional para tu salud visual",
  },
  {
    image: slide4,
    title: "Bienvenido a Óptica Opti Samuel, C.A.",
    subtitle: "Sistema de gestión óptica",
  },
];

export default function LandingWelcome({ onEnterLogin }: LandingWelcomeProps) {

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">

      {/* SLIDES */}

      {slides.map((slide, index) => (

        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out ${
            index === current
              ? "opacity-100 scale-105"
              : "opacity-0 scale-110"
          }`}
        >

          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{
              transform: index === current ? "scale(1.05)" : "scale(1.15)",
              transition: "transform 7s ease"
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"/>

        </div>

      ))}

      {/* LOGO */}

      <div className="absolute top-8 left-10 z-20">

        <img
          src="/src/assets/Logo.png"
          className="h-16 drop-shadow-2xl"
        />

      </div>

      {/* BOTON LOGIN */}

      <div className="absolute top-8 right-10 z-20">

        <Button
          onClick={onEnterLogin}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white rounded-full px-6 py-2 shadow-xl transition-all hover:scale-110"
        >
          <LogIn size={16} />
          Iniciar Sesión
        </Button>

      </div>

      {/* TEXTO */}

      <div className="absolute bottom-28 left-16 z-20 max-w-2xl">

        <h1
          key={slides[current].title}
          className="text-white text-6xl font-bold mb-4 leading-tight animate-fadeUp"
        >
          {slides[current].title}
        </h1>

        <p
          key={slides[current].subtitle}
          className="text-white/80 text-xl animate-fadeUp"
        >
          {slides[current].subtitle}
        </p>

      </div>

      {/* INDICADORES */}

      <div className="absolute bottom-10 left-16 flex gap-3 z-20">

        {slides.map((_, index) => (

          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? "w-14 bg-green-500"
                : "w-4 bg-white/40"
            }`}
          />

        ))}

      </div>

      <style>
        {`
        .animate-fadeUp{
          animation: fadeUp .8s ease;
        }

        @keyframes fadeUp{
          from{
            opacity:0;
            transform:translateY(30px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }
        `}
      </style>

    </div>
  );
}