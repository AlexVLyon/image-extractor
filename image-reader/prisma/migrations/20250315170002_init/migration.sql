-- CreateTable
CREATE TABLE "TextRecord" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TextRecord_pkey" PRIMARY KEY ("id")
);
