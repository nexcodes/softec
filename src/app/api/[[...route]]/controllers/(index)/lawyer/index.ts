import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth"; // Import the auth instance
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

  .post("/lawyer/profile", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session || !session.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  
    const user = session.user;
    const data = await c.req.json();
  
    const existingLawyer = await db.lawyer.findUnique({
      where: { userId: user.id },
    });
  
    if (user.role === "LAWYER") {
      // Already a lawyer: Update profile
      if (!existingLawyer) {
        return c.json({ error: "Lawyer profile missing" }, 404);
      }
  
      const updated = await db.lawyer.update({
        where: { userId: user.id },
        data: {
          legalName: data.legalName,
          specialization: data.specialization,
          experience: data.experience,
          description: data.description,
          licenseNo: data.licenseNo,
          fatherName: data.fatherName,
          cnic: data.cnic,
          updatedAt: new Date(),
        },
      });
  
      return c.json({ message: "Lawyer profile updated", data: updated });
    }
  
    if (user.role === "USER") {
      // User upgrading to lawyer
      if (existingLawyer) {
        return c.json({ error: "Already registered as a lawyer" }, 400);
      }
  
      // Check required fields
      const requiredFields = [
        "legalName",
        "experience",
        "description",
        "licenseNo",
        "fatherName",
        "cnic",
      ];
  
      for (const field of requiredFields) {
        if (!data[field]) {
          return c.json({ error: `Missing required field: ${field}` }, 400);
        }
      }
  
      const created = await db.lawyer.create({
        data: {
          legalName: data.legalName,
          specialization: data.specialization,
          experience: data.experience,
          description: data.description,
          licenseNo: data.licenseNo,
          fatherName: data.fatherName,
          cnic: data.cnic,
          isVerified: false,
          userId: user.id,
        },
      });
  
      // Promote user to LAWYER
      await db.user.update({
        where: { id: user.id },
        data: { role: "LAWYER" },
      });
  
      return c.json({ message: "Lawyer profile created", data: created });
    }
  
    return c.json({ error: "Forbidden for your role" }, 403);
  })
  

  .put("/lawyer/profile", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session || !session.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  
    const user = session.user;
    const data = await c.req.json();
  
    const existingLawyer = await db.lawyer.findUnique({
      where: { userId: user.id },
    });
  
    if (user.role === "LAWYER") {
      if (!existingLawyer) {
        return c.json({ error: "Lawyer profile missing" }, 404);
      }
  
      // Preserve old data if no new input
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
          updatedAt: new Date(),
        },
      });
  
      return c.json({ message: "Lawyer profile updated", data: updated });
    }
  
    if (user.role === "USER") {
      if (existingLawyer) {
        return c.json({ error: "Already registered as a lawyer" }, 400);
      }
  
      const requiredFields = [
        "legalName",
        "experience",
        "description",
        "licenseNo",
        "fatherName",
        "cnic",
      ];
  
      for (const field of requiredFields) {
        if (!data[field]) {
          return c.json({ error: `Missing required field: ${field}` }, 400);
        }
      }
  
      const created = await db.lawyer.create({
        data: {
          legalName: data.legalName,
          specialization: data.specialization,
          experience: data.experience,
          description: data.description,
          licenseNo: data.licenseNo,
          fatherName: data.fatherName,
          cnic: data.cnic,
          isVerified: false,
          userId: user.id,
        },
      });
  
      await db.user.update({
        where: { id: user.id },
        data: { role: "LAWYER" },
      });
  
      return c.json({ message: "Lawyer profile created", data: created });
    }
  
    return c.json({ error: "Forbidden for your role" }, 403);
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
