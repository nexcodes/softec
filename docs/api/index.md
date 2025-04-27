# API Routes Documentation

This documentation provides guidance on how to create and organize API routes in this project.

## Overview

This project uses [Hono](https://hono.dev/) as the API framework for handling HTTP requests with Next.js route handlers. The API routes are organized in a structured way to maintain scalability and readability.

## Project Structure

```
src/
  app/
    api/
      [[...route]]/             # Catch-all route for API endpoints
        route.ts                # Main route handler
        controllers/            # Controllers for different API resources
          (index)/              # Index controllers
            index.ts            # Main index exports
            sample/             # Sample resource controller
              index.ts          # Sample routes implementation
```

## Creating a New API Resource

To create a new API resource (e.g., users, products), follow these steps:

1. Create a new folder in `src/app/api/[[...route]]/controllers/(index)/` with the resource name
2. Create an `index.ts` file within the folder to define the routes
3. Register the resource in the main `route.ts` file

## Route Implementation

Each resource should export a Hono app instance with defined routes. Here's an example based on the sample implementation:

```typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono()
  // GET route with validation
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        /* validation schema */
      })
    ),
    (c) => {
      // Route handler logic
      return c.json({
        /* response data */
      });
    }
  )
  // POST route
  .post(
    '/',
    zValidator(
      'body',
      z.object({
        /* validation schema */
      })
    ),
    (c) => {
      // Route handler logic
      return c.json({
        /* response data */
      });
    }
  );

export default app;
```

## Route Registration

After creating your resource routes, register them in the main `route.ts` file:

```typescript
// In src/app/api/[[...route]]/route.ts
import { sample } from './controllers/(index)';
import { yourNewResource } from './controllers/(index)';

const routes = app
  .route('/sample', sample)
  .route('/your-resource-path', yourNewResource);
```

## Validation

The project uses Zod with Hono's zValidator for request validation:

1. Define a Zod schema for query parameters, URL parameters, or request body
2. Add the validator middleware to your route
3. Access validated data with `c.req.valid()`

Example:

```typescript
zValidator('query', z.object({ id: z.string() })),
  (c) => {
    const { id } = c.req.valid('query');
    // Use validated id safely
  };
```

## Error Handling

Error handling is centralized in the main route file with `app.onError`. Throw `HTTPException` for specific status codes or let the default handler manage unexpected errors.

## Client Usage

The API can be consumed client-side using the Hono client:

```typescript
import { client } from '@/lib/hono';

// Example usage
const response = await client.sample.$get();
const data = await response.json();
```

## Best Practices

1. Group related endpoints under a single resource
2. Use Zod validation for all input data
3. Follow RESTful conventions for endpoint naming
4. Keep controller logic focused on request handling and delegate business logic to service files
5. Use meaningful HTTP status codes for responses
