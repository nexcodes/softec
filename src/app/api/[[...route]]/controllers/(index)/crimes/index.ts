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
    try {
      const crimes = await db.crime.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          media: true,
          comments: {
            include: {
              user: true,
            },
          },
          votes: {
            include: {
              user: true,
            },
          },
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
        message: "Crimes retrieved successfully.",
        data: formattedCrimes,
        status: 200,
      });
    } catch (error) {
      return c.json(
        {
          message: "Failed to retrieve crimes.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .post("/", zValidator("json", createCrimeSchema), async (c) => {
    try {
      const body = await c.req.valid("json");
      const { title, description, location, userId, isLive } = body;

      const newCrime = await db.crime.create({
        data: {
          title,
          description,
          location,
          isLive,
          user: userId ? { connect: { id: userId } } : undefined,
        },
      });

      return c.json({
        message: "Crime created successfully.",
        data: newCrime,
        status: 201,
      });
    } catch (error) {
      return c.json(
        {
          message: "Failed to create crime.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .put(
    "/:id",
    zValidator("param", idParamSchema),
    zValidator("json", updateCrimeSchema),
    async (c) => {
      try {
        const crimeId = c.req.valid("param").id;
        const body = await c.req.valid("json");

        const updatedCrime = await db.crime.update({
          where: { id: crimeId },
          data: {
            title: body.title,
            description: body.description,
            location: body.location,
            isLive: body.isLive,
            isVerified: body.isVerified,
          },
        });

        return c.json({
          message: "Crime updated successfully.",
          data: updatedCrime,
        });
      } catch (error) {
        return c.json(
          {
            message: "Failed to update crime.",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  .get("/search", zValidator("query", searchCrimeSchema), async (c) => {
    try {
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
    } catch (error) {
      return c.json(
        {
          message: "Search failed.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .get("/:id", zValidator("param", idParamSchema), async (c) => {
    const id = c.req.valid("param").id;

    try {
      const crime = await db.crime.findUnique({
        where: { id },
        include: {
          media: true,
          comments: {
            include: {
              user: true,
            },
          },
          votes: {
            include: {
              user: true,
            },
          },
          user: true,
        },
      });

      if (!crime) {
        return c.json({ message: "Crime not found." }, 404);
      }

      const totalVotes = crime.votes.length;
      const upvotes = crime.votes.filter((v) => v.value === true).length;
      const downvotes = totalVotes - upvotes;

      return c.json({
        message: "Crime retrieved successfully.",
        data: {
          ...crime,
          voteStats: {
            total: totalVotes,
            upvotes,
            downvotes,
          },
        },
        status: 200,
      });
    } catch (error) {
      return c.json(
        {
          message: "Failed to retrieve crime.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .post(
    "/:id/vote",
    zValidator("param", idParamSchema),
    zValidator("json", voteSchema),
    async (c) => {
      const userId = (await currentUser())?.id;
      const crimeId = c.req.valid("param").id;
      const { value } = await c.req.valid("json");

      if (!userId) {
        return c.json({ error: "Unauthorized!" }, 401);
      }

      try {
        const existingVote = await db.vote.findUnique({
          where: {
            userId_crimeId: {
              userId,
              crimeId,
            },
          },
        });

        if (!existingVote) {
          const vote = await db.vote.create({
            data: {
              userId,
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
                userId,
                crimeId,
              },
            },
          });
          return c.json({ message: "Vote removed.", status: 200 });
        }

        const updatedVote = await db.vote.update({
          where: {
            userId_crimeId: {
              userId,
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
      } catch (error) {
        return c.json(
          {
            message: "Failed to vote.",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  .post(
    "/:id/comments",
    zValidator("param", idParamSchema),
    zValidator("json", createCommentSchema),
    async (c) => {
      const userId = (await currentUser())?.id;
      const crimeId = c.req.valid("param").id;
      const { content } = await c.req.valid("json");

      if (!content) {
        return c.json({ message: "Comment content is required." }, 400);
      }

      if (!userId) {
        return c.json({ error: "Unauthorized!" }, 401);
      }

      try {
        // Check if user exists
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
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
            userId,
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
      } catch (error) {
        return c.json(
          {
            message: "Failed to create comment.",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  .get("/:id/comments", zValidator("param", idParamSchema), async (c) => {
    const crimeId = c.req.valid("param").id;

    try {
      // Optional: Check if crime exists
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
    } catch (error) {
      return c.json(
        {
          message: "Failed to fetch comments.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  });

export default app;
