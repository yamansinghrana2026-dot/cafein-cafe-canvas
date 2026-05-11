
-- Set search_path on remaining functions
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Revoke execute from anon/authenticated on internal functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten reservation insert: require basic non-empty fields
DROP POLICY "Anyone can create reservations" ON public.reservations;
CREATE POLICY "Anyone can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 5 AND 20
    AND guests BETWEEN 1 AND 30
    AND date >= CURRENT_DATE - 1
  );
