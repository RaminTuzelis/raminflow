CREATE TYPE "public"."unit_type" AS ENUM('PCS', 'M', 'M2', 'KG');--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "unit" "unit_type" DEFAULT 'PCS' NOT NULL;