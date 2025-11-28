import { unstable_noStore as noStore } from "next/cache";
import { getPersonalContent } from "./actions";
import PersonalSectionEditor from "@/components/admin/PersonalSectionEditor";

export default async function PersonalAdminPage() {
    noStore();
    const personal = await getPersonalContent();

    return (
        <div className="space-y-4">
            <PersonalSectionEditor initial={personal} />
        </div>
    );
}
