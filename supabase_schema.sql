-- =====================================================
-- ESQUEMA DE BASE DE DATOS - LA DIETA DEL CORRAL
-- Ejecutar este script completo en Supabase SQL Editor
-- =====================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla users (referencia a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS en users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para users
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- 5. Función para crear usuario automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger para auto-crear perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Tabla day_progress (misiones diarias)
CREATE TABLE IF NOT EXISTS public.day_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 22),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  tasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day)
);

ALTER TABLE public.day_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress" ON public.day_progress
  FOR ALL USING (auth.uid() = user_id);

-- 8. Tabla challenge_info (fecha inicio del reto)
CREATE TABLE IF NOT EXISTS public.challenge_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.challenge_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own challenge" ON public.challenge_info
  FOR ALL USING (auth.uid() = user_id);

-- 9. Tabla workout_progress (ejercicios por día del reto)
CREATE TABLE IF NOT EXISTS public.workout_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  challenge_day INTEGER NOT NULL CHECK (challenge_day >= 1 AND challenge_day <= 22),
  completed_exercises TEXT[] DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_day)
);

ALTER TABLE public.workout_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workouts" ON public.workout_progress
  FOR ALL USING (auth.uid() = user_id);

-- 10. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Triggers para updated_at
DROP TRIGGER IF EXISTS update_day_progress_updated_at ON public.day_progress;
CREATE TRIGGER update_day_progress_updated_at
  BEFORE UPDATE ON public.day_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workout_progress_updated_at ON public.workout_progress;
CREATE TRIGGER update_workout_progress_updated_at
  BEFORE UPDATE ON public.workout_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_day_progress_user_id ON public.day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_day_progress_day ON public.day_progress(day);
CREATE INDEX IF NOT EXISTS idx_workout_progress_user_id ON public.workout_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_progress_day ON public.workout_progress(challenge_day);
