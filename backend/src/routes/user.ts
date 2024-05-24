import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt'


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>()

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    
    const body = await c.req.json()
    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
    })

    if(!user) {
        c.status(403)
        return c.json({ error: 'User not found' })
    }
    const jwt = await sign({ id: user.id}, c.env.JWT_SECRET)
    return c.json({ jwt })
})

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    
    const body = await c.req.json()
    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name
            }
        })
        const payload = {
            id: user.id
        }
        const secret = c.env.JWT_SECRET
        const token = await sign(payload, secret)
        return c.json({
            jwt: token,
        })
    } catch (err) {
        c.status(403)
        return c.json({ error: "Error while signing up" })
    }
})

