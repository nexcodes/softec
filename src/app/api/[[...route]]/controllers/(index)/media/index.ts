import { db } from '@/lib/db';
import { zValidator } from '@hono/zod-validator';
import { MediaType } from '@prisma/client';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono().post(
  '/',
  zValidator(
    'json',
    z.object({
      url: z.string().url(),
      type: z.nativeEnum(MediaType),
      crimeId: z.string(),
    })
  ),
  async (c) => {
    const data = c.req.valid('json');

    const media = await db.media.create({
      data: {
        url: data.url,
        type: data.type,
        crimeId: data.crimeId,
      },
    });

    return c.json({ message: 'Media created successfully!', media }, 201);
  }
);

export default app;
