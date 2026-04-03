import { useState } from "react";
import type { Role } from "../../../types/roles"; 
import logo from "@/assets/logo.png";
import RecuperarPassword from "./RecuperarPassword";

interface LoginProps {
  onLogin: (role: Role) => void;
}

const Login = ({ onLogin }: LoginProps) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showRecover, setShowRecover] = useState(false);

  const handleAuth = () => {
    const userLower = username.toLowerCase();

    if (userLower === "admin") {
      onLogin("administrador");
    } else if (userLower === "samuel" || userLower === "optometrista") {
      onLogin("optometrista");
    } else {
      onLogin("recepcionista");
    }
  };

  /* SI ESTA EN RECUPERAR CONTRASEÑA */

  if (showRecover) {
    return (
      <RecuperarPassword
        onBackToLogin={() => setShowRecover(false)}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* FONDO */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#95d5b2] to-[#ffffff]"></div>

      {/* EFECTOS */}
      <div className="absolute w-[700px] h-[700px] bg-green-400/40 blur-3xl rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[600px] h-[600px] bg-green-600/30 blur-3xl rounded-full -bottom-40 -right-40"></div>

      {/* TARJETA */}
      <div className="relative bg-[#1a4731] p-10 rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-md text-center">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Opti Samuel"
            className="w-56 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* TITULO */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Sistema Administrativo
          </h1>

          <p className="text-green-200/80 text-xs uppercase tracking-[0.3em] mt-2">
            Óptica Opti Samuel • 2026
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">

          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          {/* RECUPERAR CONTRASEÑA */}

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowRecover(true)}
              className="text-sm text-green-200 hover:text-white transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            onClick={handleAuth}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-lg shadow-md transition-all active:scale-95"
          >
            Ingresar
          </button>

        </div>

        <p className="mt-10 text-white/30 text-xs tracking-widest uppercase">
          Sistema de Gestion • Óptica Opti Samuel, C.A.
        </p>

      </div>
    </div>
  );
};

export default Login;