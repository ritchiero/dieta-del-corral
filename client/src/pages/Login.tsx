import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'login' | 'signup' | 'forgot';

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loading, signIn, signUp, resetPassword } = useAuthContext();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Alias para compatibilidad
  const isSignUp = viewMode === 'signup';
  const setIsSignUp = (val: boolean) => setViewMode(val ? 'signup' : 'login');

  useEffect(() => {
    if (user && !loading) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (viewMode === 'forgot') {
      setIsSubmitting(true);
      try {
        await resetPassword(email);
        toast.success('¡Revisa tu email!', {
          description: 'Te enviamos un enlace para restablecer tu contraseña.',
        });
        setViewMode('login');
      } catch (error: any) {
        toast.error(error.message || 'Error al enviar email');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    
    if (isSignUp && password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('¡Cuenta creada! Revisa tu email para confirmar.');
      } else {
        await signIn(email, password);
        toast.success('¡Bienvenido de vuelta!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-bold">
            La Dieta del Corral
          </h1>
          <p className="text-muted-foreground text-lg">
            22 Días de Disciplina
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
          <div className="space-y-2 text-center">
            {viewMode === 'forgot' && (
              <button
                type="button"
                onClick={() => setViewMode('login')}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
            )}
            <h2 className="text-2xl font-semibold">
              {viewMode === 'forgot' 
                ? 'Recuperar Contraseña'
                : isSignUp 
                  ? 'Crear Cuenta' 
                  : 'Bienvenido'
              }
            </h2>
            <p className="text-sm text-muted-foreground">
              {viewMode === 'forgot'
                ? 'Te enviaremos un enlace para restablecer tu contraseña'
                : isSignUp 
                  ? 'Regístrate para comenzar tu transformación'
                  : 'Inicia sesión para continuar tu progreso'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {viewMode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  {viewMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setViewMode('forgot')}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  minLength={6}
                />
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  minLength={6}
                />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {viewMode === 'forgot' 
                    ? 'Enviando...' 
                    : isSignUp 
                      ? 'Creando cuenta...' 
                      : 'Iniciando sesión...'
                  }
                </>
              ) : (
                viewMode === 'forgot'
                  ? 'Enviar Enlace'
                  : isSignUp 
                    ? 'Crear Cuenta' 
                    : 'Iniciar Sesión'
              )}
            </Button>
          </form>

          {viewMode !== 'forgot' && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
                disabled={isSubmitting}
              >
                {isSignUp 
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate'
                }
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Tus datos están seguros y sincronizados en la nube
        </p>
      </div>
    </div>
  );
}
