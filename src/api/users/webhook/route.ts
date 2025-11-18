import { Webhook } from "svix";

export async function POST(request: Request) {
   const signingSecret = process.env.CLERK_SIGNING_SECRET;

   if (!signingSecret) {
      return new Response("Signing secret not configured", { status: 500 });
   }
   const wh = new Webhook(signingSecret);
   // Read headers from the incoming Request (route handlers should use request.headers)
   const svix_id = request.headers.get("svix-id") || "";
   const svix_timestamp = request.headers.get("svix-timestamp") || "";
   const svix_signature = request.headers.get("svix-signature") || "";

   if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing signature headers", { status: 400 });
   }

   const payload = await request.json();
   const body = JSON.stringify(payload);
   let evt: unknown;

   try {
      // svix.verify expects header names with hyphens (as sent by Svix)
      evt = wh.verify(body, {
         "svix-id": svix_id,
         "svix-timestamp": svix_timestamp,
         "svix-signature": svix_signature,
      }) as unknown;
   } catch (error) {
      console.error("Error verifying webhook:", error);
      return new Response("Invalid signature", { status: 401 });
   }
   // Narrow the verified event shape for safe property access
   const verified = evt as { data?: { id?: string }; type?: string } | undefined;
   const id = verified?.data?.id;
   const eventType = verified?.type;
   console.log("Received event:", eventType, "for user ID:", id);
   return new Response("Webhook processed", { status: 200 });
}
