import { unstable_noStore as noStore } from "next/cache";
import { getExperienceContent } from "./actions";
import ExperienceSectionEditor from "@/components/admin/ExperienceSectionEditor";


export default async function ExperienceAdminPage() {
    noStore();
    const experience = await getExperienceContent();

    return (
        <div className="space-y-4">
            <ExperienceSectionEditor initial={experience} />
        </div>
    );
}
