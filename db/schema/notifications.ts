import { sql } from "drizzle-orm";
import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../helpers/columns.helpers";
import { generateUniqueString } from "../helpers/slug.helpers";

export const notifications = pgTable("notification", {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    slug: varchar().$default(() => generateUniqueString(16)),
    userId: varchar("user_id")
        .references(() => users.id)
        .notNull(),
    message: text("message").notNull(),
    read: boolean("read").default(false).notNull(),
    ...timestamps,
});
