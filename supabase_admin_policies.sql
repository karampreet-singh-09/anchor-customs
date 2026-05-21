-- Allow admins to read all orders
CREATE POLICY "Allow admins to read all orders" ON "public"."orders"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.jwt() ->> 'email' IN ('karampreets090@gmail.com', 'madhur123rastogi@gmail.com'));

-- Update the existing update policy to include the new admin
DROP POLICY IF EXISTS "Allow admin to update orders" ON "public"."orders";

CREATE POLICY "Allow admin to update orders" ON "public"."orders"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.jwt() ->> 'email' IN ('karampreets090@gmail.com', 'madhur123rastogi@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('karampreets090@gmail.com', 'madhur123rastogi@gmail.com'));
