import { db } from "@/lib/db";
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
    const lawyerData = await c.req.json();
    const lawyer = await db.lawyer.create({ data: lawyerData });

    return c.json({
      message: "Lawyer created successfully.",
      data: lawyer,
      status: 201,
    });
  })
  .put("/lawyers/:id", async (c) => {
    const id = c.req.param("id");

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
  })
  .delete("/lawyers/:id", async (c) => {
    const id = c.req.param("id");

    const existing = await db.lawyer.findUnique({ where: { id } });

    if (!existing) {
      return c.json({ message: "Lawyer not found." }, 406);
    }

    await db.lawyer.delete({ where: { id } });

    return c.json({
      message: "Lawyer deleted successfully.",
      status: 200,
    });
  });

export default app;
