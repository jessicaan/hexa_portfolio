import { unstable_noStore as noStore } from "next/cache";
import { getAboutContent } from "./actions";
import AboutSectionEditor from "@/components/admin/AboutSectionEditor";

export default async function AboutAdminPage() {
  noStore();
  const about = await getAboutContent();

  return (
    <div className="space-y-4">
      <AboutSectionEditor initial={about} />
    </div>
  );
}
