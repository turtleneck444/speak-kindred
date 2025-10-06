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