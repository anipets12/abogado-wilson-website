import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [networkRetry, setNetworkRetry] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Si el usuario ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Limpiar errores si el usuario cambia credenciales
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email, password]);

  // Función para manejar reintentos en caso de errores de red
  const executeWithRetry = async (fn, maxRetries = 5) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        setNetworkRetry(i > 0);
        return await fn();
      } catch (err) {
        console.log(`Intento ${i + 1} fallido. Reintentando...`);
        lastError = err;
        // Esperar antes de reintentar (1s, 2s, 4s - backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    setNetworkRetry(false);
    throw lastError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validación básica
      if (!email) throw new Error('El correo electrónico es obligatorio');
      if (!password) throw new Error('La contraseña es obligatoria');

      // Iniciar sesión con reintento en caso de error de red
      console.log('Intentando iniciar sesión con:', email);
      const { data, error: signInError } = await executeWithRetry(() => 
        supabase.auth.signInWithPassword({
          email,
          password
        })
      );
      
      if (signInError) {
        console.error('Error de autenticación:', signInError);
        throw signInError;
      }
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      console.log('Login exitoso, redirigiendo...');
      toast.success('Inicio de sesión exitoso');
      
      // Pequeña espera para asegurar que los datos de sesión se guarden correctamente
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      
      // Mensajes de error mejorados y específicos
      let errorMessage;
      
      if (err.message === 'Invalid login credentials' || err.message.includes('invalid')) {
        errorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
      } else if (err.message.includes('fetch') || err.message.includes('network') || err.name === 'TypeError') {
        errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setNetworkRetry(false);
    }
  };
  
  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      
      // Improved error handling for social login with retry logic
      console.log(`Iniciando login con ${provider}...`);
      const { data, error } = await executeWithRetry(() => 
        supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        })
      );
      
      if (error) {
        console.error(`Error en OAuth con ${provider}:`, error);
        throw error;
      }
      
      // No es necesario redireccionar, Supabase lo hace automáticamente
    } catch (err) {
      console.error(`Error en login con ${provider}:`, err);
      let errorMessage = `Error al iniciar sesión con ${provider}`;
      
      if (err.message.includes('fetch') || err.message.includes('network') || err.name === 'TypeError') {
        errorMessage += ': Error de conexión. Por favor, verifica tu conexión a internet.';
      } else {
        errorMessage += `: ${err.message}`;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setNetworkRetry(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link to="/recuperar-contrasena" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continuar con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaGoogle className="text-red-500 mr-2 h-5 w-5" />
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaFacebook className="text-blue-600 mr-2 h-5 w-5" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
