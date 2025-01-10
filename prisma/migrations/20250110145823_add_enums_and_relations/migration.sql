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
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("address", "capacity", "category", "city", "contactEmail", "contactPhone", "country", "createdAt", "date", "description", "endDate", "id", "image", "isPublic", "location", "organizer", "price", "registrationDeadline", "status", "tags", "title", "type", "updatedAt", "venue") SELECT "address", "capacity", "category", "city", "contactEmail", "contactPhone", "country", "createdAt", "date", "description", "endDate", "id", "image", "isPublic", "location", "organizer", "price", "registrationDeadline", "status", "tags", "title", "type", "updatedAt", "venue" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_EventRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "dietaryRequirements" TEXT,
    "specialRequirements" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "eventId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EventRegistration" ("createdAt", "dietaryRequirements", "email", "eventId", "id", "name", "organization", "phone", "specialRequirements", "status", "updatedAt") SELECT "createdAt", "dietaryRequirements", "email", "eventId", "id", "name", "organization", "phone", "specialRequirements", "status", "updatedAt" FROM "EventRegistration";
DROP TABLE "EventRegistration";
ALTER TABLE "new_EventRegistration" RENAME TO "EventRegistration";
CREATE UNIQUE INDEX "EventRegistration_eventId_email_key" ON "EventRegistration"("eventId", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
