import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth"; // Import the auth instance
import { Hono } from "hono";

const app = new Hono()
  .get("/", async (c) => {
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

  .post("/profile", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
  
    // Ensure the user is authenticated
    if (!session || !session.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  
    const user = session.user;
    const data = await c.req.json();
  
    // Check if the user's email is verified
    if (!user.emailVerified) {
      return c.json({ error: "Email not verified. Please verify your email before proceeding." }, 400);
    }
  
    // Check if the user already has a lawyer profile
    const existingLawyer = await db.lawyer.findUnique({
      where: { userId: user.id },
    });
  
    // If the user is already a lawyer, inform them
    if (existingLawyer) {
      return c.json({ error: "You are already registered as a lawyer" }, 400);
    }
  
    if (user.role === "USER") {
      // If the user is a regular user, allow them to upgrade to a lawyer
  
      // Validate that all required lawyer fields are provided
      const requiredFields = ["legalName", "experience", "description", "licenseNo", "fatherName", "cnic"];
      for (const field of requiredFields) {
        if (!data[field]) {
          return c.json({ error: `Missing required field: ${field}` }, 400);
        }
      }
  
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
        data: { role: "LAWYER" },
      });
  
      return c.json({ message: "Successfully upgraded to Lawyer", data: createdLawyer });
    }
  
    // If the user role is neither LAWYER nor USER, return forbidden
    return c.json({ error: "Forbidden for your role" }, 403);
  })
  
  .put("/profile", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
  
    // Ensure the user is authenticated
    if (!session || !session.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  
    const user = session.user;
    const data = await c.req.json();
  
    // Check if the user is a Lawyer
    if (user.role !== "LAWYER") {
      return c.json({ error: "Only a Lawyer can update their profile" }, 403);
    }
  
    // Fetch the existing Lawyer profile
    const existingLawyer = await db.lawyer.findUnique({
      where: { userId: user.id },
    });
  
    // If the Lawyer profile does not exist, return an error
    if (!existingLawyer) {
      return c.json({ error: "Lawyer profile not found" }, 404);
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
        updatedAt: new Date(), // Ensure the profile update timestamp is set
      },
    });
  
    // Return a success message along with the updated data
    return c.json({ message: "Lawyer profile updated", data: updated });
  })
  

  .delete("/:id", async (c) => {
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
  .get("/:id", async (c) => {
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
  .get("/search", async (c) => {
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
