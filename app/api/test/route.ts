import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  const doc = await adminDb.collection("test").doc("hello").set({ ok: true });
  return Response.json({ success: true });
}
