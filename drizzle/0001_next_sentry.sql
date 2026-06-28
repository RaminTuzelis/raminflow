CREATE TYPE "public"."material_type" AS ENUM('PP', 'PE', 'PVC', 'PVDF');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"material_type" "material_type" NOT NULL,
	"thickness_mm" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;