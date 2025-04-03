CREATE TABLE "doctor_departments" (
	"doctor_id" varchar(255) NOT NULL,
	"department_id" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "doctor_departments_doctor_id_department_id_pk" PRIMARY KEY("doctor_id","department_id")
);
--> statement-breakpoint
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_department_id_department_id_fk";
--> statement-breakpoint
ALTER TABLE "doctor_departments" ADD CONSTRAINT "doctor_departments_doctor_id_doctor_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_departments" ADD CONSTRAINT "doctor_departments_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" DROP COLUMN "department_id";