-- CreateEnum
CREATE TYPE "vehicle_type" AS ENUM ('Sedan', 'Hatchback', 'SUV', 'Van', 'Bus');

-- CreateEnum
CREATE TYPE "fuel_type" AS ENUM ('Petrol', 'Diesel', 'EV');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('Pending', 'Booked', 'Canceled');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "mail_id" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "coming_from" TEXT NOT NULL,
    "type_of_group" TEXT NOT NULL,
    "adult" INTEGER NOT NULL DEFAULT 0,
    "child" INTEGER NOT NULL DEFAULT 0,
    "car_category" TEXT NOT NULL,
    "taxi_type" TEXT NOT NULL,
    "contact_method" TEXT NOT NULL,
    "night_stays" INTEGER NOT NULL DEFAULT 0,
    "rooms_required" INTEGER NOT NULL DEFAULT 1,
    "room_budget" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "hotels" JSONB,
    "taxis" JSONB,
    "routes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "rating" DECIMAL(4,2) DEFAULT 0,
    "distance_from_center" TEXT,
    "stay_type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_highlighted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT,
    "hotel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "hotel_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "data" TEXT,

    CONSTRAINT "hotel_amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_experience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "hotel_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cab_booking" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pickup_point" TEXT NOT NULL,
    "drop_point" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "no_of_passengers" INTEGER NOT NULL,
    "vehicle_type" "vehicle_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" "booking_status" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "cab_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "self_drive_car_request" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pickup_location" TEXT NOT NULL,
    "drop_location" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "no_of_days" INTEGER NOT NULL,
    "notes" TEXT,
    "fuel_type" "fuel_type" NOT NULL,
    "driver_needed" BOOLEAN NOT NULL,
    "car_category" "vehicle_type" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "self_drive_car_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bike_rental" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pickup_location" TEXT NOT NULL,
    "drop_location" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "no_of_days" INTEGER NOT NULL,
    "notes" TEXT,
    "fuel_type" "fuel_type" NOT NULL,
    "driver_needed" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "bike_rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "category" TEXT,
    "type" TEXT,
    "address" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "location_url" TEXT,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_image" (
    "id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public_id" TEXT,

    CONSTRAINT "activity_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_review" (
    "id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "user_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "activity_image_activity_id_idx" ON "activity_image"("activity_id");

-- CreateIndex
CREATE INDEX "activity_review_activity_id_idx" ON "activity_review"("activity_id");

-- AddForeignKey
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_image" ADD CONSTRAINT "hotel_image_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_amenity" ADD CONSTRAINT "hotel_amenity_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_experience" ADD CONSTRAINT "hotel_experience_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cab_booking" ADD CONSTRAINT "cab_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "self_drive_car_request" ADD CONSTRAINT "self_drive_car_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bike_rental" ADD CONSTRAINT "bike_rental_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_image" ADD CONSTRAINT "activity_image_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_review" ADD CONSTRAINT "activity_review_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
