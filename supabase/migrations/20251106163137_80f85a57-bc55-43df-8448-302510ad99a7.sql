-- Create quick_phrases table
CREATE TABLE IF NOT EXISTS public.quick_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_emergency BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quick_phrases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quick_phrases
CREATE POLICY "Users can view own and default phrases"
  ON public.quick_phrases FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can insert own phrases"
  ON public.quick_phrases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phrases"
  ON public.quick_phrases FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own phrases"
  ON public.quick_phrases FOR DELETE
  USING (auth.uid() = user_id);

-- Create sentence_templates table
CREATE TABLE IF NOT EXISTS public.sentence_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern TEXT NOT NULL,
  category TEXT NOT NULL,
  slots TEXT[] NOT NULL,
  example TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sentence_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sentence_templates
CREATE POLICY "Users can view own and default templates"
  ON public.sentence_templates FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can insert own templates"
  ON public.sentence_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON public.sentence_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON public.sentence_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Enhanced usage tracking - add more context
ALTER TABLE public.usage_events 
ADD COLUMN IF NOT EXISTS session_id UUID,
ADD COLUMN IF NOT EXISTS context TEXT,
ADD COLUMN IF NOT EXISTS board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL;

-- Create function to update updated_at timestamp for quick_phrases
CREATE OR REPLACE FUNCTION public.update_quick_phrases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for quick_phrases
CREATE TRIGGER update_quick_phrases_timestamp
  BEFORE UPDATE ON public.quick_phrases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quick_phrases_updated_at();

-- Insert default quick phrases
INSERT INTO public.quick_phrases (phrase, category, is_emergency, user_id) VALUES
  ('I need help!', 'emergency', true, NULL),
  ('Call 911', 'emergency', true, NULL),
  ('I feel sick', 'emergency', true, NULL),
  ('Stop!', 'emergency', true, NULL),
  ('I need water', 'basic_needs', false, NULL),
  ('I need food', 'basic_needs', false, NULL),
  ('I need to use the bathroom', 'basic_needs', false, NULL),
  ('I need a break', 'basic_needs', false, NULL),
  ('I''m tired', 'basic_needs', false, NULL),
  ('I''m hungry', 'basic_needs', false, NULL),
  ('I''m thirsty', 'basic_needs', false, NULL),
  ('I''m happy', 'feelings', false, NULL),
  ('I''m sad', 'feelings', false, NULL),
  ('I''m excited', 'feelings', false, NULL),
  ('I''m frustrated', 'feelings', false, NULL),
  ('I''m confused', 'feelings', false, NULL),
  ('I''m scared', 'feelings', false, NULL),
  ('I love you', 'feelings', false, NULL),
  ('Hello', 'social', false, NULL),
  ('Goodbye', 'social', false, NULL),
  ('Thank you', 'social', false, NULL),
  ('Please', 'social', false, NULL),
  ('You''re welcome', 'social', false, NULL),
  ('Good morning', 'social', false, NULL),
  ('Good night', 'social', false, NULL),
  ('I''m sorry', 'social', false, NULL),
  ('Yes', 'general', false, NULL),
  ('No', 'general', false, NULL),
  ('Maybe', 'general', false, NULL),
  ('I don''t know', 'general', false, NULL),
  ('Can you repeat that?', 'general', false, NULL),
  ('I understand', 'general', false, NULL)
ON CONFLICT DO NOTHING;