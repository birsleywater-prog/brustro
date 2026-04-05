import { writeFileSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file || file.size === 0) {
        return json({ error: 'No file uploaded' }, { status: 400 });
    }

    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = extname(file.name).toLowerCase();
    if (!allowed.includes(ext)) {
        return json({ error: 'Invalid file type. Allowed: jpg, png, webp, gif' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'static', 'uploads');
    mkdirSync(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(join(uploadDir, filename), buffer);

    return json({ url: `/uploads/${filename}` });
};
