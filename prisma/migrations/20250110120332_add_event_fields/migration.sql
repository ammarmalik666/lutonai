-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "endDate" DATETIME,
    "location" TEXT NOT NULL,
    "image" TEXT,
    "capacity" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'IN_PERSON',
    "venue" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "organizer" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "registrationDeadline" DATETIME,
    "price" REAL,
    "category" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("createdAt", "date", "description", "id", "image", "location", "title", "updatedAt") SELECT "createdAt", "date", "description", "id", "image", "location", "title", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
