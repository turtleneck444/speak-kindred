-- Add categories for organizing tiles
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text,
  color text DEFAULT '#3A86FF',
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add tile categories relationship
ALTER TABLE public.tiles ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.tiles ADD COLUMN image_url text;
ALTER TABLE public.tiles ADD COLUMN icon_name text;

-- Quick phrases library
CREATE TABLE public.quick_phrases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase text NOT NULL,
  category text DEFAULT 'general',
  is_emergency boolean DEFAULT false,
  usage_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Word prediction history
CREATE TABLE public.word_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  word text NOT NULL,
  frequency int DEFAULT 1,
  last_used_at timestamptz DEFAULT now()
);

-- User preferences expansion
ALTER TABLE public.profiles ADD COLUMN preferences jsonb DEFAULT '{
  "enableWordPrediction": true,
  "enableScanning": false,
  "scanningSpeed": 1500,
  "enableAutoSpeak": false,
  "showRecentlyUsed": true,
  "maxRecentTiles": 6,
  "enableEmergencyBar": true,
  "tileSize": "medium",
  "gridColumns": 4
}'::jsonb;

-- Recently used tiles view
CREATE OR REPLACE VIEW public.recent_tiles AS
SELECT DISTINCT ON (t.id)
  t.*,
  MAX(ue.occurred_at) as last_used
FROM public.tiles t
JOIN public.usage_events ue ON ue.tile_id = t.id
GROUP BY t.id
ORDER BY t.id, last_used DESC;

-- Indexes
CREATE INDEX idx_categories_owner ON public.categories(owner_id, order_index);
CREATE INDEX idx_tiles_category ON public.tiles(category_id);
CREATE INDEX idx_quick_phrases_owner ON public.quick_phrases(owner_id, category);
CREATE INDEX idx_quick_phrases_emergency ON public.quick_phrases(owner_id, is_emergency) WHERE is_emergency = true;
CREATE INDEX idx_word_history_user ON public.word_history(user_id, frequency DESC);

-- RLS Policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own categories"
  ON public.categories FOR ALL
  USING (owner_id = auth.uid());

-- RLS Policies for quick phrases
ALTER TABLE public.quick_phrases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own quick phrases"
  ON public.quick_phrases FOR ALL
  USING (owner_id = auth.uid());

-- RLS Policies for word history
ALTER TABLE public.word_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own word history"
  ON public.word_history FOR ALL
  USING (user_id = auth.uid());

-- Function to update word history
CREATE OR REPLACE FUNCTION public.update_word_history(p_user_id uuid, p_word text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.word_history (user_id, word, frequency, last_used_at)
  VALUES (p_user_id, p_word, 1, now())
  ON CONFLICT (user_id, word) 
  DO UPDATE SET 
    frequency = word_history.frequency + 1,
    last_used_at = now();
END;
$$;

-- Function to get word predictions
CREATE OR REPLACE FUNCTION public.get_word_predictions(p_user_id uuid, p_prefix text, p_limit int DEFAULT 5)
RETURNS TABLE (word text, frequency int)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT wh.word, wh.frequency
  FROM public.word_history wh
  WHERE wh.user_id = p_user_id
    AND wh.word ILIKE p_prefix || '%'
  ORDER BY wh.frequency DESC, wh.last_used_at DESC
  LIMIT p_limit;
END;
$$;

-- Insert default categories
INSERT INTO public.categories (owner_id, name, icon, color, order_index)
SELECT 
  id,
  unnest(ARRAY['Basic', 'Feelings', 'People', 'Actions', 'Places', 'Food']),
  unnest(ARRAY['MessageSquare', 'Heart', 'Users', 'Zap', 'MapPin', 'Utensils']),
  unnest(ARRAY['#3A86FF', '#EF476F', '#8E7DBE', '#FFD166', '#06D6A0', '#FF6B35']),
  unnest(ARRAY[0, 1, 2, 3, 4, 5])
FROM auth.users
WHERE id IN (SELECT id FROM public.profiles);

-- Insert default quick phrases
INSERT INTO public.quick_phrases (owner_id, phrase, category, is_emergency)
SELECT 
  id,
  unnest(ARRAY[
    'I need help',
    'Call for assistance',
    'I''m in pain',
    'Emergency',
    'I''m okay',
    'Thank you for helping',
    'I need the bathroom',
    'I''m hungry',
    'I''m thirsty',
    'I''m tired',
    'I''m cold',
    'I''m hot',
    'Good morning',
    'Good night',
    'I love you',
    'Please wait',
    'I need a break',
    'Can we go home?'
  ]),
  unnest(ARRAY[
    'emergency', 'emergency', 'emergency', 'emergency',
    'general', 'general', 'basic_needs', 'basic_needs', 
    'basic_needs', 'feelings', 'feelings', 'feelings',
    'social', 'social', 'social', 'general', 'general', 'general'
  ]),
  unnest(ARRAY[
    true, true, true, true,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false, false, false
  ])
FROM auth.users
WHERE id IN (SELECT id FROM public.profiles);
