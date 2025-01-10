-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "logo" TEXT,
    "tier" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
