# ApplyTrack — Future Integration Guide

This guide outlines how to connect a production database (Prisma / PostgreSQL / Supabase) and authentication provider (NextAuth / Auth.js / Clerk) to ApplyTrack without modifying the UI components.

---

## 1. Database Integration (Prisma + PostgreSQL)

ApplyTrack is architected around the **Repository Pattern** in [`lib/db/index.js`](file:///c:/Users/Admin/applytrack/lib/db/index.js). To switch from in-memory storage to a production database:

### Step 1: Install Prisma
```bash
npm install @prisma/client
npm install -D prisma
```

### Step 2: Configure Environment Variable
In your `.env.local` or `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/applytrack?schema=public"
```

### Step 3: Run Database Migrations
The Prisma schema has already been pre-generated for you at [`prisma/schema.prisma`](file:///c:/Users/Admin/applytrack/prisma/schema.prisma):
```bash
npx prisma db push
# or
npx prisma migrate dev --name init
```

### Step 4: Swap `lib/db/index.js`
Replace the implementation in [`lib/db/index.js`](file:///c:/Users/Admin/applytrack/lib/db/index.js) with Prisma Client queries:

```javascript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = {
  async findMany(params = {}) {
    const where = {};
    if (params.search) {
      where.OR = [
        { company: { contains: params.search, mode: "insensitive" } },
        { role: { contains: params.search, mode: "insensitive" } },
      ];
    }
    if (params.status && params.status !== "ALL") where.status = params.status;
    if (params.workplace && params.workplace !== "ALL") where.workplaceType = params.workplace;

    return prisma.jobApplication.findMany({
      where,
      orderBy: { [params.sortBy || "appliedDate"]: params.sortOrder || "desc" },
    });
  },

  async findById(id) {
    return prisma.jobApplication.findUnique({ where: { id } });
  },

  async create(data) {
    return prisma.jobApplication.create({ data });
  },

  async update(id, data) {
    return prisma.jobApplication.update({ where: { id }, data });
  },

  async delete(id) {
    await prisma.jobApplication.delete({ where: { id } });
    return true;
  },

  async getMetrics() {
    // Real-time aggregations using prisma.jobApplication.count()
  }
};
```
*Zero changes are needed in `ApplicationsService`, Server Actions, or UI components.*

---

## 2. Authentication Integration (NextAuth / Auth.js / Clerk)

Authentication is abstracted through [`lib/auth/session.js`](file:///c:/Users/Admin/applytrack/lib/auth/session.js).

### Option A: Clerk
1. Install `@clerk/nextjs`:
   ```bash
   npm install @clerk/nextjs
   ```
2. In [`lib/auth/session.js`](file:///c:/Users/Admin/applytrack/lib/auth/session.js):
   ```javascript
   import { currentUser } from "@clerk/nextjs/server";

   export async function getCurrentUser() {
     const user = await currentUser();
     if (!user) return null;
     return {
       id: user.id,
       name: `${user.firstName} ${user.lastName}`,
       email: user.emailAddresses[0]?.emailAddress,
       avatar: user.imageUrl,
     };
   }
   ```

### Option B: NextAuth / Auth.js (v5)
1. Install NextAuth:
   ```bash
   npm install next-auth@beta
   ```
2. In [`lib/auth/session.js`](file:///c:/Users/Admin/applytrack/lib/auth/session.js):
   ```javascript
   import { auth } from "@/auth";

   export async function getCurrentUser() {
     const session = await auth();
     return session?.user || null;
   }
   ```
