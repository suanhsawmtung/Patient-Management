CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'completed', 'canceled', 'rescheduled');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('paid', 'unpaid', 'partial');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'accountant', 'doctor', 'patient', 'receptionist');--> statement-breakpoint
CREATE TABLE "accountant" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"certification_number" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "appointment" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar,
	"patient_id" varchar NOT NULL,
	"doctor_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"status" "appointment_status" DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "department" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar,
	"name" varchar(255) NOT NULL,
	"description" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "department_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "doctor_availability" (
	"doctor_id" varchar NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"is_available" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "doctor_availability_doctor_id_day_of_week_pk" PRIMARY KEY("doctor_id","day_of_week")
);
--> statement-breakpoint
CREATE TABLE "doctor" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"specialty" varchar(255) NOT NULL,
	"degree" varchar(255) NOT NULL,
	"contact_number" varchar(255) NOT NULL,
	"license_number" varchar(255) NOT NULL,
	"consultation_fee" numeric NOT NULL,
	"department_id" varchar,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "doctor_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar,
	"patient_id" varchar NOT NULL,
	"appointment_id" varchar,
	"amount" numeric NOT NULL,
	"status" "invoice_status" DEFAULT 'unpaid' NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp NOT NULL,
	"paid_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "medical_record" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar,
	"patient_id" varchar NOT NULL,
	"doctor_id" varchar NOT NULL,
	"diagnosis" text NOT NULL,
	"treatment" text NOT NULL,
	"prescription" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar,
	"user_id" varchar NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "patient" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"blood_group" varchar(5),
	"insurance_info" text,
	"address1" text NOT NULL,
	"address2" text,
	"height" numeric NOT NULL,
	"weight" numeric NOT NULL,
	"alergy" varchar(255) NOT NULL,
	"diet" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "receptionist" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"shift_start" timestamp NOT NULL,
	"shift_end" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"slug" varchar,
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"role" "role" NOT NULL,
	"gender" "gender" NOT NULL,
	"image" varchar,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accountant" ADD CONSTRAINT "accountant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_patient_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_doctor_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_availability" ADD CONSTRAINT "doctor_availability_doctor_id_doctor_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_patient_id_patient_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_patient_id_patient_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_doctor_id_doctor_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receptionist" ADD CONSTRAINT "receptionist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;