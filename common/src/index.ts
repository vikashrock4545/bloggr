import { z } from 'zod'

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(30),
    name: z.string().min(1).max(50),
})

export type SignupType = z.infer<typeof signupInput>

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(30),
})

export type SigninType = z.infer<typeof signinInput>

export const createPostInput = z.object({
    title: z.string().min(1).max(30),
    content: z.string().min(1).max(300),
})

export type CreatePostType = z.infer<typeof createPostInput>

export const updatePostInput = z.object({
    id: z.string().min(1).max(30),
    title: z.string().min(1).max(30),
    content: z.string().min(1).max(300),
})

export type UpdatePostType = z.infer<typeof updatePostInput>