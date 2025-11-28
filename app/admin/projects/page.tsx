import { unstable_noStore as noStore } from "next/cache";
import { getProjectsContent } from "./actions";
import ProjectsSectionEditor from "@/components/admin/ProjectsSectionEditor";

export default async function ProjectsAdminPage() {
    noStore();
    const projects = await getProjectsContent();

    return (
        <div className="space-y-4">
            <ProjectsSectionEditor initial={projects} />
        </div>
    );
}
