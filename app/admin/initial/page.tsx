import { unstable_noStore as noStore } from "next/cache";
import { getInitialContent } from "./actions";
import InitialSectionEditor from "@/components/admin/InitialSectionEditor";

export default async function InitialSectionPage() {
  noStore();
  const initial = await getInitialContent();

  return (
    <div className="space-y-4">
      <InitialSectionEditor initial={initial} />
    </div>
  );
}
