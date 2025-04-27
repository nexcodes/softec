import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createCrimeSchema,
  updateCrimeSchema,
  searchCrimeSchema,
  voteSchema,
  createCommentSchema,
  idParamSchema,
} from "@/schema";
import { currentUser } from "@/lib/current-user";

const app = new Hono()
  .get("/", async (c) => {
    const crimes = await db.crime.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        media: true,
      },
    });

    return c.json({
      message: "Crimes retrieved successfully.",
      data: crimes,
      status: 200,
    });
  })
  .get("/locations", async (c) => {
    try {
      const crimes = await db.crime.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          latitude: true,
          longitude: true,
          reportedAt: true,
          crimeType: true,
          incidentDate: true,
        },
      });

      return c.json(
        {
          message: "Crime locations retrieved successfully.",
          data: crimes,
        },
        200
      );
    } catch (error) {
      console.error("Error fetching crime locations:", error);
      return c.json(
        {
          message: "Failed to fetch crime locations.",
        },
        500
      );
    }
  })
  .post("/", zValidator("json", createCrimeSchema), async (c) => {
    const body = await c.req.valid("json");
    const user = await currentUser();

    if (!user || !user.id) {
      return c.json({ error: "Unauthorized!" }, 401);
    }

    const newCrime = await db.crime.create({
      data: { ...body, isLive: true, userId: user.id },
    });

    return c.json({
      message: "Crime created successfully.",
      data: newCrime,
      status: 201,
    });
  })
  .put(
    "/:id",
    zValidator("param", idParamSchema),
    zValidator("json", updateCrimeSchema),
    async (c) => {
      const { id: crimeId } = c.req.valid("param");
      const body = await c.req.valid("json");

      const updatedCrime = await db.crime.update({
        where: { id: crimeId },
        data: {
          title: body.title,
          description: body.description,
          location: body.location,
        },
      });

      return c.json({
        message: "Crime updated successfully.",
        data: updatedCrime,
      });
    }
  )
  .get("/search", zValidator("query", searchCrimeSchema), async (c) => {
    const { query } = c.req.valid("query");

    const crimes = await db.crime.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        media: true,
        comments: { include: { user: true } },
        votes: { include: { user: true } },
        user: true,
      },
    });

    const formattedCrimes = crimes.map((crime) => {
      const totalVotes = crime.votes.length;
      const upvotes = crime.votes.filter((v) => v.value === true).length;
      const downvotes = totalVotes - upvotes;

      return {
        ...crime,
        voteStats: {
          total: totalVotes,
          upvotes,
          downvotes,
        },
      };
    });

    return c.json({
      message: "Search successful.",
      data: formattedCrimes,
      status: 200,
    });
  })
  .get("/:id", zValidator("param", idParamSchema), async (c) => {
    const id = c.req.valid("param").id;

    const crime = await db.crime.findUnique({
      where: { id },
      include: {
        media: true,
        comments: true,
      },
    });

    if (!crime) {
      return c.json({ message: "Crime not found." }, 404);
    }

    return c.json({
      message: "Crime retrieved successfully.",
      data: crime,
    });
  })
  .post(
    "/:id/vote",
    zValidator("param", idParamSchema),
    zValidator("json", voteSchema),
    async (c) => {
      const user = await currentUser();
      const crimeId = c.req.valid("param").id;
      const { value } = await c.req.valid("json");

      if (!user || !user.id) {
        return c.json({ error: "Unauthorized!" }, 401);
      }

      const existingVote = await db.vote.findUnique({
        where: {
          userId_crimeId: {
            userId: user.id,
            crimeId,
          },
        },
      });

      if (!existingVote) {
        const vote = await db.vote.create({
          data: {
            userId: user.id,
            crimeId,
            value,
          },
        });
        return c.json({ message: "Vote recorded.", data: vote, status: 201 });
      }

      if (existingVote.value === value) {
        await db.vote.delete({
          where: {
            userId_crimeId: {
              userId: user.id,
              crimeId,
            },
          },
        });
        return c.json({ message: "Vote removed.", status: 200 });
      }

      const updatedVote = await db.vote.update({
        where: {
          userId_crimeId: {
            userId: user.id,
            crimeId,
          },
        },
        data: {
          value,
        },
      });

      return c.json({
        message: "Vote updated.",
        data: updatedVote,
        status: 200,
      });
    }
  )
  .post(
    "/:id/comments",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", createCommentSchema),
    async (c) => {
      const user = await currentUser();
      const crimeId = c.req.valid("param").id;
      const { content } = await c.req.valid("json");

      if (!crimeId) {
        return c.json({ message: "Crime ID is required." }, 400);
      }

      if (!content) {
        return c.json({ message: "Comment content is required." }, 400);
      }

      if (!user || !user.id) {
        return c.json({ error: "Unauthorized!" }, 401);
      }

      // Check if user exists
      const dbUser = await db.user.findUnique({ where: { id: user.id } });
      if (!dbUser) {
        return c.json({ message: "User not found." }, 404);
      }

      // Check if crime exists
      const crime = await db.crime.findUnique({ where: { id: crimeId } });
      if (!crime) {
        return c.json({ message: "Crime not found." }, 404);
      }

      const comment = await db.comment.create({
        data: {
          content,
          userId: user.id,
          crimeId,
        },
        include: {
          user: true,
        },
      });

      return c.json({
        message: "Comment created.",
        data: comment,
        status: 201,
      });
    }
  )
  .get("/:id/comments", zValidator("param", idParamSchema), async (c) => {
    const { id: crimeId } = c.req.valid("param");

    const crime = await db.crime.findUnique({ where: { id: crimeId } });
    if (!crime) {
      return c.json({ message: "Crime not found." }, 404);
    }

    const comments = await db.comment.findMany({
      where: { crimeId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({
      message: "Comments fetched successfully.",
      data: comments,
      status: 200,
    });
  })
  .get("/map", async (c) => {
    const crimes = await db.crime.findMany({
      where: { isLive: true },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({
      message: "Crimes fetched successfully.",
      data: crimes,
      status: 200,
    });
  });

export default app;
