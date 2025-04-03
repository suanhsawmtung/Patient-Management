import { env, isProduction } from "@/lib/env.lib";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { AuthPayload } from "@/types/auth.types";
import { users as usersTable } from "@/db/schema/users";
import { comparePassword } from "@/lib/password.lib";
import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const data: AuthPayload = await req.json();

    const { email, password } = data;

    const dbUsers = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

    const user = dbUsers[0];

    if (!user) {
        return Response.json(
            {
                success: false,
                message: "User not found",
            },
            { status: 404 }
        );
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);

    if (!passwordMatch) {
        return Response.json(
            {
                success: false,
                message: "Invalid credentials",
            },
            { status: 401 }
        );
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    (await cookies()).set({
        name: "accessToken",
        value: token,
        httpOnly: true,
        secure: isProduction(),
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return Response.json({
        success: true,
        message: "Authenticated Successfully",
        user: {
            id: user.id,
            email: user.email,
        },
    });
}
