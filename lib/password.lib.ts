import bcrypt from "bcrypt";
import { env } from "./env.lib";

export const hashOfPassword = env.DEMO_PASSWORD_HASH;

export const comparePassword = async (
    plainPassword: string,
    hashPassword: string
) => {
    const passwordMatch = await bcrypt.compare(plainPassword, hashPassword);
    return passwordMatch;
};

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
