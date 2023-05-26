-- CreateTable
CREATE TABLE "StallStuff" (
    "id" SERIAL NOT NULL,
    "stall_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,

    CONSTRAINT "StallStuff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StallStuff_staff_id_key" ON "StallStuff"("staff_id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "StallStuff" ADD CONSTRAINT "StallStuff_stall_id_fkey" FOREIGN KEY ("stall_id") REFERENCES "Stall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StallStuff" ADD CONSTRAINT "StallStuff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
