import {unstable_noStore as noStore} from 'next/cache';
import {getExperienceContent} from '@/app/admin/experience/actions';
import {getEducationContent} from "@/app/admin/education/actions";
import {getProjectsContent} from "@/app/admin/projects/actions";
import {getSkillsContent} from "@/app/admin/skills/actions";
import HomeClient from './page-client';

export default async function HomePage() {
    noStore();
    const experienceContent = await getExperienceContent();
    const educationContent = await getEducationContent();
    const projectsContent = await getProjectsContent();
    const skillsContent = await getSkillsContent();

    return <HomeClient 
        experienceContent={experienceContent} 
        educationContent={educationContent} 
        projectsContent={projectsContent}
        skillsContent={skillsContent}
    />;
}
