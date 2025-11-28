import { unstable_noStore as noStore } from "next/cache";
import { getSkillsContent } from "./actions";
import SkillsSectionEditor from "@/components/admin/SkillsSectionEditor";

export default async function SkillsAdminPage() {
    noStore();
    const skills = await getSkillsContent();

    return (
        <div className="space-y-4">
            <SkillsSectionEditor initial={skills} />
        </div>
    );
}
