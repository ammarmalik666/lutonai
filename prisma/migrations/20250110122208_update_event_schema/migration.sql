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
    "type" TEXT NOT NULL,
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
    "status" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("address", "capacity", "category", "city", "contactEmail", "contactPhone", "country", "createdAt", "date", "description", "endDate", "id", "image", "isPublic", "location", "organizer", "price", "registrationDeadline", "status", "tags", "title", "type", "updatedAt", "venue") SELECT "address", "capacity", "category", "city", "contactEmail", "contactPhone", "country", "createdAt", "date", "description", "endDate", "id", "image", "isPublic", "location", "organizer", "price", "registrationDeadline", "status", "tags", "title", "type", "updatedAt", "venue" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
