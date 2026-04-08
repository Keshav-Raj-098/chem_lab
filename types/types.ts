import {z,ZodError} from "zod";

export const LoginSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(8)
});


export type LoginData = z.infer<typeof LoginSchema>;

export type TokenPayload = {
    username: string;
    role: string;
    iat: number;
    exp: number;
};

