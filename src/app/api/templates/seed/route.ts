import { NextResponse } from 'next/server';

import { createNewTemplateAction, deleteAllTemplatesAction } from '@/backend/actions/template';
import { createNewForm } from '@/lib/form';
import { templates as templateSeeds } from '@/utils/data';

export const revalidate = 0;

export async function GET() {
  try {
    // Start fresh each time for idempotency during development
    await deleteAllTemplatesAction();

    const created: unknown[] = [];

    for (const seed of templateSeeds) {
      const baseConfig = createNewForm('SYSTEM');

      if (!baseConfig) continue;

      const formConfig = {
        ...baseConfig,
        name: seed.name,
        description: seed.description,
      };

      const res = await createNewTemplateAction(
        {
          name: seed.name,
          description: seed.description,
          image: '',
        },
        formConfig,
      );

      if (!res.success) {
        throw new Error(typeof res.error === 'string' ? res.error : 'Failed to create template');
      }

      created.push(res.data);
    }

    return NextResponse.json({ success: true, count: created.length, data: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong while seeding templates';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


