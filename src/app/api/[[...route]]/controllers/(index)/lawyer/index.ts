import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Hono } from "hono";

const app = new Hono()
  .get("/lawyers", async (c) => {
    try {
      let page = Number(c.req.query("page")) || 1;
      let limit = Number(c.req.query("limit")) || 10;

      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

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
            message: "No verified lawyers found.",
            status: 200,
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
        message: "Verified lawyers retrieved successfully.",
        status: 200,
        data: lawyers,
        metadata: {
          page,
          limit,
          totalPages,
          totalLawyers,
        },
      });
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      return c.json(
        {
          message: "An error occurred while fetching lawyers.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .post("/lawyers", async (c) => {
    try {
      const lawyerData = await c.req.json();
      const lawyer = await db.lawyer.create({ data: lawyerData });

      return c.json({
        message: "Lawyer created successfully.",
        data: lawyer,
        status: 201,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = (error.meta?.target as string[]) || [];

        if (target.includes("cnic")) {
          return c.json(
            { message: "A lawyer with this CNIC already exists." },
            409
          );
        } else if (target.includes("licenseNo")) {
          return c.json(
            { message: "A lawyer with this license number already exists." },
            409
          );
        } else {
          return c.json({ message: "A unique field already exists." }, 409);
        }
      }

      return c.json(
        {
          message: "An error occurred while creating the lawyer.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .put("/lawyers/:id", async (c) => {
    const id = c.req.param("id");

    try {
      const data = await c.req.json();

      const existing = await db.lawyer.findUnique({ where: { id } });
      if (!existing) {
        return c.json({ message: "Lawyer not found." }, 406);
      }

      const updatedLawyer = await db.lawyer.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return c.json({
        message: "Lawyer updated successfully.",
        data: updatedLawyer,
        status: 200,
      });
    } catch (error) {
      return c.json(
        {
          message: "Failed to update lawyer.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .delete("/lawyers/:id", async (c) => {
    const id = c.req.param("id");

    try {
      const existing = await db.lawyer.findUnique({ where: { id } });

      if (!existing) {
        return c.json({ message: "Lawyer not found." }, 406);
      }

      await db.lawyer.delete({ where: { id } });

      return c.json({
        message: "Lawyer deleted successfully.",
        status: 200,
      });
    } catch (error) {
      return c.json(
        {
          message: "Failed to delete lawyer.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .get("/lawyers/:id", async (c) => {
    const id = c.req.param("id");

    try {
      const lawyer = await db.lawyer.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!lawyer) {
        return c.json({ message: "Lawyer not found." }, 404);
      }

      return c.json({
        message: "Lawyer retrieved successfully.",
        data: lawyer,
        status: 200,
      });
    } catch (error) {
      return c.json(
        {
          message: "Failed to fetch lawyer.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .get("/lawyers/search", async (c) => {
    const query = c.req.query("q");
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const skip = (page - 1) * limit;

    if (!query || query.trim() === "") {
      return c.json({ message: "Please provide a search query." }, 400);
    }

    try {
      const results = await db.lawyer.findMany({
        where: {
          isVerified: true,
          OR: [
            { legalName: { contains: query, mode: "insensitive" } },
            { specialization: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          user: true,
        },
        orderBy: {
          legalName: "asc",
        },
        skip,
        take: limit,
      });

      return c.json({
        message: `Search results for "${query}"`,
        data: results,
        pagination: {
          page,
          limit,
        },
        status: 200,
      });
    } catch (error) {
      return c.json(
        {
          message: "Failed to search lawyers.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  });

export default app;
