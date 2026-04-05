import { useState, type FormEvent } from "react";
import { ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { authService } from "@/services/authService";

export default function RecuperarPassword({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA PASO 1: ENVIAR CORREO ---
  const handleRequestReset = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); 
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset(email);
      setStep(2); 
    } catch (err: any) {
      setError("No se pudo enviar el correo. Verifica que el email esté registrado.");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA PASO 2: CAMBIAR CONTRASEÑA ---
  const handleConfirmReset = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!token || !password) return;

    setLoading(true);
    setError(null);
    try {
      await authService.confirmPasswordReset(token, password);
      alert("¡Contraseña actualizada con éxito!");
      onBackToLogin();
    } catch (err: any) {
      setError("El código (token) es inválido o ya expiró.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#95d5b2] to-[#ffffff]"></div>

      {/* EFECTOS DE LUZ */}
      <div className="absolute w-[700px] h-[700px] bg-green-400/40 blur-3xl rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[600px] h-[600px] bg-green-600/30 blur-3xl rounded-full -bottom-40 -right-40"></div>

      <div className="relative bg-[#1a4731] p-10 rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-md text-center">
        
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Opti Samuel" className="w-56 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]" />
        </div>

        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            {step === 1 ? "Recuperar Contraseña" : "Nueva Contraseña"}
          </h1>
          <p className="text-green-200/80 text-xs uppercase tracking-[0.3em] mt-2">
            {step === 1 ? "Óptica Opti Samuel • 2026" : "Ingresa el código enviado"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* USAMOS <form> PARA HABILITAR EL "ENTER" AUTOMÁTICAMENTE */}
        <form onSubmit={step === 1 ? handleRequestReset : handleConfirmReset} className="space-y-5">
          {step === 1 ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                required
                className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar instrucciones"}
              </button>
            </>
          ) : (
            <>
              {/* NOTIFICACIÓN DE ENVÍO EXITOSO */}
              <div className="flex items-center gap-2 text-green-300 text-xs bg-green-900/40 p-3 rounded-lg mb-2 border border-green-500/20">
                <CheckCircle2 size={16} />
                <span className="text-left font-medium">Verifique su correo electrónico. Le hemos enviado un código.</span>
              </div>
              
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Código del correo (Token)"
                required
                className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe tu nueva clave"
                required
                className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />

              <button
                type="submit"
                disabled={loading || !token || !password}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-semibold text-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><KeyRound size={20} /> Cambiar Clave</>}
              </button>
            </>
          )}
        </form>

        <button
          onClick={onBackToLogin}
          className="flex items-center justify-center gap-2 text-green-200 hover:text-white transition text-sm w-full mt-6"
        >
          <ArrowLeft size={16} />
          Volver al Login
        </button>

        <p className="mt-10 text-white/30 text-xs tracking-widest uppercase">
          Sistema de Gestion • Óptica Opti Samuel, C.A.
        </p>
      </div>
    </div>
  );
}