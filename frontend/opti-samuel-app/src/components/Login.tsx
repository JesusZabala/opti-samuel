import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('')
        try{
            const data = await authService.login(username,password);
            login(data.access);
            navigate('/');
        }catch(err){
            setError('Usuario y contraseña incorrectos');

        }
    };

    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
        <div className="flex justify-center mb-4 text-blue-600">
          <LogIn size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Acceso Opti-Samuel</h2>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <input
          type="text"
          placeholder="Usuario"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Ingresar
        </button>
      </form>
    </div>
  );

}