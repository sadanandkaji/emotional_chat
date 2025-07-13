-- CreateTable
CREATE TABLE "JoinedRoom" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "JoinedRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JoinedRoom_userId_roomId_key" ON "JoinedRoom"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "JoinedRoom" ADD CONSTRAINT "JoinedRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinedRoom" ADD CONSTRAINT "JoinedRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
