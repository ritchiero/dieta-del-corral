import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Asegurar que el usuario exista en public.users (sin bloquear)
function ensureUserExists(user: User) {
  if (!user) return;
  
  // Ejecutar en background sin bloquear
  (async () => {
    try {
      // Verificar si ya existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (!existingUser) {
        // Crear el usuario en public.users
        console.log('[ensureUserExists] Creando usuario en public.users:', user.id);
        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
          });
        
        if (error) {
          // Ignorar si ya existe (race condition)
          if (error.code !== '23505') {
            console.error('[ensureUserExists] Error creando usuario:', error);
          }
        } else {
          console.log('[ensureUserExists] Usuario creado exitosamente');
        }
      } else {
        console.log('[ensureUserExists] Usuario ya existe en public.users');
      }
    } catch (e) {
      console.error('[ensureUserExists] Error:', e);
    }
  })();
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Asegurar que el usuario exista en public.users (background)
      if (session?.user) {
        ensureUserExists(session.user);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Asegurar que el usuario exista en public.users (background)
      if (session?.user) {
        ensureUserExists(session.user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Asegurar que el usuario exista (background)
    if (data.user) {
      ensureUserExists(data.user);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    
    // Asegurar que el usuario exista (background)
    if (data.user) {
      ensureUserExists(data.user);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
}
