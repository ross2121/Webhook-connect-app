-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zap" (
    "id" TEXT NOT NULL,
    "trigerId" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Zap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "metaData" JSONB NOT NULL DEFAULT '{}',
    "SortingOrder" INTEGER NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actionavailable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Actionavailable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Zapid" TEXT NOT NULL,
    "trigerid" TEXT NOT NULL,
    "metaData" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigeredavailable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Trigeredavailable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zaprun" (
    "id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "zapId" TEXT NOT NULL,

    CONSTRAINT "Zaprun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zapoutbox" (
    "id" TEXT NOT NULL,
    "zaprunid" TEXT NOT NULL,

    CONSTRAINT "Zapoutbox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Zap" ADD CONSTRAINT "Zap_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Actionavailable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_Zapid_fkey" FOREIGN KEY ("Zapid") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_trigerid_fkey" FOREIGN KEY ("trigerid") REFERENCES "Trigeredavailable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zaprun" ADD CONSTRAINT "Zaprun_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zapoutbox" ADD CONSTRAINT "Zapoutbox_zaprunid_fkey" FOREIGN KEY ("zaprunid") REFERENCES "Zaprun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
