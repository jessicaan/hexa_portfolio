import HomeClient from './page-client';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';

export default async function Page() {
    noStore();

    return <HomeClient />;
}
