-- Fix for Email Confirmation: Allow users to read the Order ID immediately after inserting so the email can be sent
CREATE POLICY "Allow users to read their own orders" ON "public"."orders"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);
