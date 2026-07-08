// import { useState } from 'react';
// import { Role } from '../../../types/roles';
// import logo from '@/assets/logo.png';
// import RecuperarPassword from './RecuperarPassword';
// import { authService } from '@/services/authService';
// import axios from 'axios';
// import { Eye, EyeOff } from "lucide-react";

// interface LoginProps {
//   onLogin: (role: Role) => void;
// }

// const Login = ({ onLogin }: LoginProps) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showRecover, setShowRecover] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleAuth = async (e?: React.FormEvent) => {
//     // Prevenimos que la página se recargue al presionar Enter
//     if (e) e.preventDefault();

//     if (!username.trim() || !password) {
//       alert('Ingresa usuario y contraseña.');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const { role } = await authService.login(username, password);
//       onLogin(role);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const msg =
//           (error.response?.data as { detail?: string; non_field_errors?: string[] })?.detail ??
//           (error.response?.data as { non_field_errors?: string[] })?.non_field_errors?.[0] ??
//           error.message;
//         alert(typeof msg === 'string' ? msg : 'No se pudo iniciar sesión.');
//       } else if (error instanceof Error) {
//         alert(error.message);
//       } else {
//         alert('No se pudo iniciar sesión.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (showRecover) {
//     return <RecuperarPassword onBackToLogin={() => setShowRecover(false)} />;
//   }

//   return (
//     <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
//       <div className='absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#95d5b2] to-[#ffffff]'></div>
//       <div className='absolute w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-green-400/40 blur-3xl rounded-full -top-20 md:-top-40 -left-20 md:-left-40'></div>
//       <div className='absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-green-600/30 blur-3xl rounded-full -bottom-20 md:-bottom-40 -right-20 md:-right-40'></div>

//       <div className='relative bg-[#1a4731] p-6 md:p-10 rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-md mx-4 md:mx-auto text-center'>
//         <div className='flex justify-center mb-8'>
//           <img
//             src={logo}
//             alt='Opti Samuel'
//             className='w-44 md:w-56 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]'
//           />
//         </div>

//         <div className='mb-8'>
//           <h1 className='text-white text-xl md:text-2xl font-semibold tracking-tight'>Sistema Administrativo</h1>
//           <p className='text-green-200/80 text-xs uppercase tracking-[0.3em] mt-2'>Óptica Opti Samuel • 2026</p>
//         </div>

//         {/* CAMBIO: Envolvemos todo en un <form> */}
//         <form onSubmit={handleAuth} className='space-y-5'>
//           <input
//             type='text'
//             placeholder='Nombre de usuario'
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className='w-full px-5 py-4 rounded-xl bg-white text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition'
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Contraseña"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-5 py-4 pr-12 rounded-xl bg-white text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
//             >
//               {showPassword ? (
//                 <EyeOff size={20} strokeWidth={2.5} />
//               ) : (
//                 <Eye size={20} strokeWidth={2.5} />
//               )}
//             </button>
//           </div>

//           <div className='text-right'>
//             <button
//               type='button'
//               onClick={() => setShowRecover(true)}
//               className='text-sm text-green-200 hover:text-white transition'>
//               ¿Olvidaste tu contraseña?
//             </button>
//           </div>

//           {/* CAMBIO: type='submit' permite que el Enter funcione */}
//           <button
//             type='submit'
//             disabled={submitting}
//             className='w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-60 text-white font-semibold text-lg shadow-md transition-all active:scale-95'>
//             {submitting ? 'Ingresando…' : 'Ingresar'}
//           </button>
//         </form>

//         <p className='mt-10 text-white/30 text-xs tracking-widest uppercase'>
//           Sistema de Gestion • Óptica Opti Samuel, C.A.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';
import { Role } from '../../../types/roles';
import logo from '@/assets/logo.png';
import RecuperarPassword from './RecuperarPassword';
import { authService } from '@/services/authService';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (role: Role) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // MODIFICADO: Lee de sessionStorage para persistir si el navegador se recarga en el teléfono
  const [showRecover, setShowRecover] = useState(() => {
    return sessionStorage.getItem("recuperando_active") === "true";
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e?: React.FormEvent) => {
    // Prevenimos que la página se recargue al presionar Enter
    if (e) e.preventDefault();

    if (!username.trim() || !password) {
      alert('Ingresa usuario y contraseña.');
      return;
    }

    setSubmitting(true);
    try {
      const { role } = await authService.login(username, password);
      onLogin(role);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          (error.response?.data as { detail?: string; non_field_errors?: string[] })?.detail ??
          (error.response?.data as { non_field_errors?: string[] })?.non_field_errors?.[0] ??
          error.message;
        alert(typeof msg === 'string' ? msg : 'No se pudo iniciar sesión.');
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('No se pudo iniciar sesión.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (showRecover) {
    return (
      <RecuperarPassword 
        onBackToLogin={() => {
          sessionStorage.removeItem("recuperando_active"); // MODIFICADO: Limpia la persistencia al volver voluntariamente
          setShowRecover(false);
        }} 
      />
    );
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#95d5b2] to-[#ffffff]'></div>
      <div className='absolute w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-green-400/40 blur-3xl rounded-full -top-20 md:-top-40 -left-20 md:-left-40'></div>
      <div className='absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-green-600/30 blur-3xl rounded-full -bottom-20 md:-bottom-40 -right-20 md:-right-40'></div>

      <div className='relative bg-[#1a4731] p-6 md:p-10 rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-md mx-4 md:mx-auto text-center'>
        <div className='flex justify-center mb-8'>
          <img
            src={logo}
            alt='Opti Samuel'
            className='w-44 md:w-56 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]'
          />
        </div>

        <div className='mb-8'>
          <h1 className='text-white text-xl md:text-2xl font-semibold tracking-tight'>Sistema Administrativo</h1>
          <p className='text-green-200/80 text-xs uppercase tracking-[0.3em] mt-2'>Óptica Opti Samuel • 2026</p>
        </div>

        {/* CAMBIO: Envolvemos todo en un <form> */}
        <form onSubmit={handleAuth} className='space-y-5'>
          <input
            type='text'
            placeholder='Nombre de usuario'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-5 py-4 rounded-xl bg-white text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition'
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 pr-12 rounded-xl bg-white text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={2.5} />
              ) : (
                <Eye size={20} strokeWidth={2.5} />
              )}
            </button>
          </div>

          <div className='text-right'>
            <button
              type='button'
              onClick={() => {
                sessionStorage.setItem("recuperando_active", "true"); // MODIFICADO: Guarda la bandera antes de montar el componente
                setShowRecover(true);
              }}
              className='text-sm text-green-200 hover:text-white transition'>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* CAMBIO: type='submit' permite que el Enter funcione */}
          <button
            type='submit'
            disabled={submitting}
            className='w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-60 text-white font-semibold text-lg shadow-md transition-all active:scale-95'>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className='mt-10 text-white/30 text-xs tracking-widest uppercase'>
          Sistema de Gestion • Óptica Opti Samuel, C.A.
        </p>
      </div>
    </div>
  );
};

export default Login;