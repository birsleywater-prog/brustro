import { db } from '$lib/db';
import { siteSettings } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
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

    const aboutSettings = settingsRows.reduce((acc, curr) => {
        if (curr.key.startsWith('about_')) {
            acc[curr.key] = curr.value;
        }
        return acc;
    }, { ...defaults });

    return {
        aboutSettings
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const heroTitle = data.get('about_hero_title') as string;
        const heroDescription = data.get('about_hero_description') as string;
        const storyTitle = data.get('about_story_title') as string;
        const storyContent1 = data.get('about_story_content_1') as string;
        const storyContent2 = data.get('about_story_content_2') as string;
        const aboutImage = data.get('about_image') as string;

        const updates = [
            { key: 'about_hero_title', value: heroTitle },
            { key: 'about_hero_description', value: heroDescription },
            { key: 'about_story_title', value: storyTitle },
            { key: 'about_story_content_1', value: storyContent1 },
            { key: 'about_story_content_2', value: storyContent2 },
            { key: 'about_image', value: aboutImage }
        ];

        try {
            for (const update of updates) {
                await db.insert(siteSettings)
                    .values(update)
                    .onConflictDoUpdate({
                        target: siteSettings.key,
                        set: { value: update.value }
                    });
            }
            return { success: true };
        } catch (error) {
            console.error('Failed to update about settings:', error);
            return fail(500, { message: 'Failed to update settings' });
        }
    }
};
