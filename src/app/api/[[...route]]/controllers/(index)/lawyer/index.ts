import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import {
  createLawyerSchema,
  getLawyersBySpecializationSchema,
  idParamSchema,
  updateLawyerSchema,
} from '@/schema';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        page: z
          .string()
          .regex(/^\d+$/)
          .default('1')
          .transform((val) => Number(val)),
        limit: z
          .string()
          .regex(/^\d+$/)
          .default('10')
          .transform((val) => Number(val)),
      })
    ),
    async (c) => {
      const { page, limit } = c.req.valid('query');

      const skip = (page - 1) * limit;

      const lawyers = await db.lawyer.findMany({
        where: { isVerified: true },
        include: {
          user: true,
        },
        skip,
        take: limit,
      });
      const totalLawyers = await db.lawyer.count();
      const totalPages = Math.ceil(totalLawyers / limit);

      if (!lawyers || lawyers.length === 0) {
        return c.json(
          {
            message: 'No verified lawyers found.',
            data: [],
            metadata: {
              page,
              limit,
              totalPages,
              totalLawyers,
            },
          },
          200
        );
      }
      return c.json({
        message: 'Verified lawyers retrieved successfully.',
        data: lawyers,
        metadata: {
          page,
          limit,
          totalPages,
          totalLawyers,
        },
      });
    }
  )
  .post(
    '/lawyer/profile',
    zValidator('json', createLawyerSchema),
    async (c) => {
      const user = await currentUser();
      // Ensure the user is authenticated
      if (!user || !user.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await c.req.valid('json');

      // Check if the user already has a lawyer profile
      const existingLawyer = await db.lawyer.findUnique({
        where: { userId: user.id },
      });

      // If the user is already a lawyer, inform them
      if (existingLawyer) {
        return c.json({ error: 'You are already registered as a lawyer' }, 400);
      }

      if (user.role === 'USER') {
        // Create the new lawyer profile
        const createdLawyer = await db.lawyer.create({
          data: {
            legalName: data.legalName,
            specialization: data.specialization,
            experience: data.experience,
            description: data.description,
            licenseNo: data.licenseNo,
            fatherName: data.fatherName,
            cnic: data.cnic,
            isVerified: false, // Initially, the lawyer profile is not verified
            userId: user.id,
          },
        });

        // Promote the user to LAWYER role
        await db.user.update({
          where: { id: user.id },
          data: { role: 'LAWYER' },
        });

        return c.json({
          message: 'Successfully upgraded to Lawyer',
          data: createdLawyer,
        });
      }

      // If the user role is neither LAWYER nor USER, return forbidden
      return c.json({ error: 'Forbidden for your role' }, 403);
    }
  )
  .put('/lawyer/profile', zValidator('json', updateLawyerSchema), async (c) => {
    const user = await currentUser();
    // Ensure the user is authenticated
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await c.req.valid('json');

    // Check if the user is a Lawyer
    if (user.role !== 'LAWYER') {
      return c.json({ error: 'Only a Lawyer can update their profile' }, 403);
    }

    // Fetch the existing Lawyer profile
    const existingLawyer = await db.lawyer.findUnique({
      where: { userId: user.id },
    });

    // If the Lawyer profile does not exist, return an error
    if (!existingLawyer) {
      return c.json({ error: 'Lawyer profile not found' }, 404);
    }

    // Update the Lawyer profile, preserving the existing data for fields that aren't provided
    const updated = await db.lawyer.update({
      where: { userId: user.id },
      data: {
        legalName: data.legalName ?? existingLawyer.legalName,
        specialization: data.specialization ?? existingLawyer.specialization,
        experience: data.experience ?? existingLawyer.experience,
        description: data.description ?? existingLawyer.description,
        licenseNo: data.licenseNo ?? existingLawyer.licenseNo,
        fatherName: data.fatherName ?? existingLawyer.fatherName,
        cnic: data.cnic ?? existingLawyer.cnic,
      },
    });

    // Return a success message along with the updated data
    return c.json({ message: 'Lawyer profile updated', data: updated });
  })
  .delete('/lawyers', async (c) => {
    const user = await currentUser();
    // Ensure the user is authenticated
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const existing = await db.lawyer.findUnique({
      where: { userId: user.id },
    });

    if (!existing) {
      return c.json({ message: 'Lawyer not found.' }, 404);
    }

    await db.lawyer.delete({ where: { userId: user.id } });

    return c.json({
      message: 'Lawyer deleted successfully.',
    });
  })
  .get('/lawyers/:id', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');

    const lawyer = await db.lawyer.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!lawyer) {
      return c.json({ message: 'Lawyer not found.' }, 404);
    }

    return c.json({
      message: 'Lawyer retrieved successfully.',
      data: lawyer,
    });
  })
  .get(
    '/lawyers/search',
    zValidator('query', getLawyersBySpecializationSchema),
    async (c) => {
      const { page, limit, specialization } = c.req.valid('query');

      const skip = (page - 1) * limit;

      const results = await db.lawyer.findMany({
        where: {
          isVerified: true,
          OR: [
            { legalName: { contains: specialization, mode: 'insensitive' } },
            {
              specialization: {
                contains: specialization,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          user: true,
        },
        orderBy: {
          legalName: 'asc',
        },
        skip,
        take: limit,
      });

      return c.json({
        message: `Search results for "${specialization}"`,
        data: results,
        pagination: {
          page,
          limit,
        },
      });
    }
  );

export default app;
