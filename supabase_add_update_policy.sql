-- Fix order updates failing for admin due to Row Level Security
CREATE POLICY "Allow admin to update orders" ON "public"."orders"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.jwt() ->> 'email' = 'karampreets090@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'karampreets090@gmail.com');
