import { useEffect, useState } from "react";
import type { Role } from "../../../types/roles"; // Agregamos un ../ más
import logo from "@/assets/logo.png"; 

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";



interface Props {
  role: Role;
  onFinish?: () => void; // función para pasar al dashboard
}

const WelcomeScreen = ({ role, onFinish }: Props) => {
  const [progress, setProgress] = useState(10);
  const [message, setMessage] = useState("Validando sesión...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish?.(); // pasa al dashboard
          }, 800);
          return 100;
        }

        const next = prev + Math.random() * 20;

        if (next > 30) setMessage("Cargando módulos...");
        if (next > 60) setMessage("Inicializando datos...");
        if (next > 85) setMessage("Finalizando configuración...");

        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onFinish]);

  const steps = [
    { label: "Sesión validada", done: progress > 25 },
    { label: "Módulos cargados", done: progress > 60 },
    { label: "Sistema listo", done: progress > 95 },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* MISMO FONDO POTENTE DEL LOGIN */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b2e1f] via-[#52b788] to-[#ffffff]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
      <div className="absolute w-[800px] h-[800px] bg-green-400/50 blur-3xl rounded-full -top-60 -left-60" />
      <div className="absolute w-[700px] h-[700px] bg-green-600/40 blur-3xl rounded-full -bottom-60 -right-60" />

      {/* TARJETA */}
      <Card className="relative w-[440px] bg-[#1a4731] border-none shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] text-white animate-fade-in">

        <CardContent className="flex flex-col items-center text-center gap-8 p-12">

          {/* LOGO */}
          <img
            src={logo}
            alt="Opti Samuel"
            className="w-44 drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
          />

          {/* BIENVENIDA */}
          <div>
            <h1 className="text-2xl font-semibold">
              Bienvenido,{" "}
              <span className="capitalize text-green-400">
                {role}
              </span>
            </h1>

            <p className="text-white/70 mt-2 text-sm">
              {message}
            </p>
          </div>

          {/* PROGRESS */}
          <div className="w-full">
            <Progress value={progress} className="h-2 bg-white/10" />
            <p className="text-xs text-white/50 mt-3">
              {Math.round(Math.min(progress, 100))}%
            </p>
          </div>

          {/* PASOS */}
          <div className="flex flex-col gap-3 w-full mt-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    step.done
                      ? "bg-green-500 border-green-500"
                      : "border-white/30"
                  }`}
                >
                  {step.done && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <p
                  className={`text-sm ${
                    step.done
                      ? "text-white"
                      : "text-white/60"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* ANIMACIÓN */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;