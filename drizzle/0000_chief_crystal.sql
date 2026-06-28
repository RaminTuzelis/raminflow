CREATE TYPE "public"."order_status" AS ENUM('DRAFT', 'APPROVED_FOR_PRODUCTION', 'IN_PRODUCTION', 'READY_FOR_DISPATCH', 'DISPATCHED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"project_name" text NOT NULL,
	"production_notes" text DEFAULT '' NOT NULL,
	"deadline" timestamp NOT NULL,
	"status" "order_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
