import { handle } from "hono/vercel";
import { Prisma } from "@prisma/client";
import {db} from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { sample } from "./controllers/(index)";
import { metadata } from "@/app/layout";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({ message: "Hello, World!" });
});

app.onError((err, c) => {
  console.log(err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ message: "Internal Error" }, 500);
});

const routes = app.route("/sample", sample);
// .route("/accounts", accounts)
// .route("/categories", categories)
// .route("/transactions", transactions);


//defining CRUD for lawyers
app.get("/lawyers", async (c) => {
  try {
    let page = Number(c.req.query("page")) || 1;
    let limit = Number(c.req.query("limit")) || 10;

    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const skip = (page - 1) * limit;

    const lawyers = await db.lawyer.findMany({
      where: { isVerified: true },
      include: {
        user: true
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
          }
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
      }
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
});


app.post("/lawyers", async (c) => {
  try {
    const lawyerData = await c.req.json();
    const lawyer = await db.lawyer.create({ data: lawyerData });

    return c.json({
      message: "Lawyer created successfully.",
      data: lawyer,
      status: 201
    });

  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[]) || [];

      if (target.includes("cnic")) {
        return c.json({ message: "A lawyer with this CNIC already exists." }, 409);
      } else if (target.includes("licenseNo")) {
        return c.json({ message: "A lawyer with this license number already exists." }, 409);
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
});

app.put("/lawyers/:id", async (c) => {
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
    return c.json({
      message: "Failed to update lawyer.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

app.delete("/lawyers/:id", async (c) => {
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
    return c.json({
      message: "Failed to delete lawyer.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

app.get("/lawyers/:id", async (c) => {
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
    return c.json({
      message: "Failed to fetch lawyer.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});


app.get("/lawyers/search", async (c) => {
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
    return c.json({
      message: "Failed to search lawyers.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});



//CRUD for crimes 
app.get("/crimes", async (c) => {
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

    const formattedCrimes = crimes.map(crime => {
      const totalVotes = crime.votes.length;
      const upvotes = crime.votes.filter(v => v.value === true).length;
      const downvotes = totalVotes - upvotes;

      return {
        ...crime,
        voteStats: {
          total: totalVotes,
          upvotes,
          downvotes,
        }
      };
    });

    return c.json({
      message: "Crimes retrieved successfully.",
      data: formattedCrimes,
      status: 200,
    });
  } catch (error) {
    return c.json({
      message: "Failed to retrieve crimes.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

app.post("/crimes", async (c) => {
  try {
    const body = await c.req.json();
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
    return c.json({
      message: "Failed to create crime.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

app.put("/crimes/:id", async (c) => {
  try {
    const crimeId = c.req.param("id");
    const body = await c.req.json();

    const updatedCrime = await db.crime.update({
      where: { id: crimeId },
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        isLive: body.isLive,
        isVerified: body.isVerified,
        updatedAt: new Date(),
      },
    });

    return c.json({
      message: "Crime updated successfully.",
      data: updatedCrime,
      status: 200,
    });
  } catch (error) {
    return c.json({
      message: "Failed to update crime.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

app.get("/crimes/search", async (c) => {
  try {
    const query = c.req.query("query");

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

    const formattedCrimes = crimes.map(crime => {
      const totalVotes = crime.votes.length;
      const upvotes = crime.votes.filter(v => v.value === true).length;
      const downvotes = totalVotes - upvotes;

      return {
        ...crime,
        voteStats: {
          total: totalVotes,
          upvotes,
          downvotes,
        }
      };
    });

    return c.json({
      message: "Search successful.",
      data: formattedCrimes,
      status: 200,
    });
  } catch (error) {
    return c.json({
      message: "Search failed.",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});




export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
