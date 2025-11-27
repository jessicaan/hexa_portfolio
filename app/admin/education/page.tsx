import { unstable_noStore as noStore } from "next/cache";
import { getEducationContent } from "./actions";
import EducationSectionEditor from "@/components/admin/EducationSectionEditor";

export default async function EducationAdminPage() {
  noStore();
  const education = await getEducationContent();

  return (
    <div className="space-y-4">
      <EducationSectionEditor initial={education} />
    </div>
  );
}
