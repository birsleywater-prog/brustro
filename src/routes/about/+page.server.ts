import { db } from '$lib/db';
import { siteSettings } from '$lib/db/schema';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';

export const load: PageServerLoad = async () => {
    const settingsRows = await db.select().from(siteSettings);
    
    // Default values matching original hardcoded content
    const defaults: Record<string, string> = {
        about_hero_title: "West Bengal's First Automated Water Plant",
        about_hero_description: "We are committed to providing the best packaged drinking water with industry experience of more than 25 years.",
        about_story_title: "Pure Water, Pure Commitment",
        about_story_content_1: `${env.PUBLIC_APP_NAME} was founded with a singular mission — to bring the highest quality packaged drinking water to homes and businesses across West Bengal. As the state's first fully automated water plant, we combine advanced technology with rigorous quality control.`,
        about_story_content_2: "With over 25 years of industry experience, our team understands the importance of pure, safe drinking water. Every bottle that leaves our facility undergoes triple-stage purification and strict quality checks.",
        about_image: ""
    };

    const settings = settingsRows.reduce((acc, curr) => {
        if (curr.key.startsWith('about_')) {
            acc[curr.key] = curr.value;
        }
        return acc;
    }, { ...defaults });

    return {
        aboutSettings: settings
    };
};
