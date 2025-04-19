import { usersTable } from "@/db/schemas";

export type NewUserT = typeof usersTable.$inferInsert;
