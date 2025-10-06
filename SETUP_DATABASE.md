# Database Setup Guide for Supabase Cloud

Follow these steps to set up your database in the Supabase Dashboard.

## Step 1: Run the First Migration (Base Tables)

1. Go to your **Supabase Dashboard** at https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button
5. Copy the ENTIRE SQL below and paste it into the editor:

```sql
-- User profiles with accessibility settings
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  settings jsonb DEFAULT '{
    "voice": "default",
    "rate": 0.45,
    "pitch": 1.0,
    "scanSpeed": 1000,
    "dwellMs": 2000,
    "theme": "high-contrast",
    "textScale": 1.2
  }'::jsonb,
  caregiver_pin text DEFAULT '1234',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Communication boards
CREATE TABLE public.boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  locale text DEFAULT 'en-US',
  is_public boolean DEFAULT false,
  is_default boolean DEFAULT false,
  version int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tiles within boards
CREATE TABLE public.tiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES public.boards(id) ON DELETE CASCADE,
  label text NOT NULL,
  speech_text text NOT NULL,
  icon_url text,
  color text DEFAULT '#3A86FF',
  order_index int DEFAULT 0,
  next_board_id uuid REFERENCES public.boards(id) ON DELETE SET NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Usage tracking for recents
CREATE TABLE public.usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tile_id uuid REFERENCES public.tiles(id) ON DELETE CASCADE,
  occurred_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_boards_owner ON public.boards(owner_id);
CREATE INDEX idx_tiles_board ON public.tiles(board_id);
CREATE INDEX idx_tiles_order ON public.tiles(board_id, order_index);
CREATE INDEX idx_usage_events_user ON public.usage_events(user_id, occurred_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER boards_updated_at
  BEFORE UPDATE ON public.boards
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Boards: owner full access, public boards readable by all
CREATE POLICY "Public boards are viewable"
  ON public.boards FOR SELECT
  USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY "Users can manage own boards"
  ON public.boards FOR ALL
  USING (owner_id = auth.uid());

-- Tiles: accessible via board access
CREATE POLICY "Tiles viewable via board access"
  ON public.tiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id
      AND (is_public = true OR owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage tiles in own boards"
  ON public.tiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id
      AND owner_id = auth.uid()
    )
  );

-- Usage events: owner only
CREATE POLICY "Users can create usage events"
  ON public.usage_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own usage events"
  ON public.usage_events FOR SELECT
  USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, caregiver_pin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    '1234'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

6. Click **Run** button (bottom right)
7. Wait for "Success. No rows returned" message
8. Verify tables were created by going to **Table Editor** in left sidebar

---

## Step 2: Run the Second Migration (Enhanced Features)

1. Still in **SQL Editor**, click **New Query** again
2. Copy the ENTIRE SQL below and paste it:

```sql
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
```

3. Click **Run** button
4. Wait for "Success" message

---

## Step 3: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should now see these tables:
   - ✅ profiles
   - ✅ boards
   - ✅ tiles
   - ✅ categories
   - ✅ quick_phrases
   - ✅ usage_events
   - ✅ word_history

---

## Step 4: Test Your App

```bash
npm run dev
```

Then:
1. Sign up for a new account
2. You should see 12 default tiles
3. Try tapping tiles to build a sentence
4. Click the emergency bar
5. Open settings and adjust options

---

## Troubleshooting

**If you get "relation already exists" errors:**
- Some tables may already exist
- You can skip those specific CREATE TABLE statements
- Or drop the tables first and re-run

**If default data doesn't appear:**
- The INSERT statements at the end of migration 2 only run for existing users
- Simply sign up for a new account and the data will be created automatically

**If you need to start fresh:**
1. Go to SQL Editor
2. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. Then run both migrations again

---

You're all set! 🎉
