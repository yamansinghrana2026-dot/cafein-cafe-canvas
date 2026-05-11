
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users can view their roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- First signup -> admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Menu items
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER menu_items_touch BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Public reads active menu" ON public.menu_items FOR SELECT USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage menu" ON public.menu_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Reservations
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INT NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER reservations_touch BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Anyone can create reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view reservations" ON public.reservations FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update reservations" ON public.reservations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete reservations" ON public.reservations FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  text TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER reviews_touch BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Public reads published reviews" ON public.reviews FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Gallery
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Site settings (key/value)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Public reads settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Seed defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_title','Brewed With Passion'),
  ('hero_subtitle','Experience premium coffee, indulgent desserts and electric cafe vibes — handcrafted at Cafein, your new favourite hangout.'),
  ('hero_badge','Najafgarh''s Premium Cafe Experience'),
  ('about_text','Born in the heart of Najafgarh, Cafein is more than a cafe — it''s a mood. We craft each espresso, dessert and shake to give you the kind of moment worth photographing, sharing and remembering.'),
  ('phone','+91 00000 00000'),
  ('hours','11:00 AM – 11:30 PM'),
  ('address','Kehra Mor, near Curl Fit Gym, Nanda Enclave, Block B, New Gopal Nagar, Najafgarh, New Delhi — 110043'),
  ('zomato_url','https://zomato.onelink.me/xqzv/qsrif0i6'),
  ('maps_url','https://maps.app.goo.gl/oCJVv2ScbG5Nuu6eA'),
  ('instagram_url','#'),
  ('facebook_url','#'),
  ('stat_customers','10K+'),
  ('stat_coffees','50K+'),
  ('stat_rating','4.8★');

INSERT INTO public.menu_items (category,name,price,rating,sort_order) VALUES
  ('Coffee','Signature Latte','₹189',4.9,1),
  ('Cold Coffee','Iced Caramel Brew','₹219',4.8,2),
  ('Pizza','Truffle Margherita','₹349',4.9,3),
  ('Burgers','Smash Cheese Stack','₹279',4.7,4),
  ('Desserts','Molten Lava Dome','₹199',5.0,5),
  ('Shakes','Strawberry Cloud','₹229',4.8,6);

INSERT INTO public.reviews (name,role,text,rating,sort_order) VALUES
  ('Aanya Sharma','Regular guest','Hands down the best cold coffee in Najafgarh. The vibe is straight out of a movie scene.',5,1),
  ('Rohit Verma','Foodie','Their truffle pizza & molten lava dome combo is unreal. I keep coming back for more.',5,2),
  ('Simran Kaur','Content creator','Every corner is a photo. Lighting, plates, coffee — chef''s kiss. My new favourite spot.',5,3);
