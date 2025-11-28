import { unstable_noStore as noStore } from "next/cache";
import { getContactContent } from "./actions";
import ContactSectionEditor from "@/components/admin/ContactSectionEditor";

export default async function ContactAdminPage() {
    noStore();
    const contact = await getContactContent();

    return (
        <div className="space-y-4">
            <ContactSectionEditor initial={contact} />
        </div>
    );
}
