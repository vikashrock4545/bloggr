import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from "@vikashrock45/bloggr-common";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>()

userRouter.get('/', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const jwt = c.req.header('Authorization')
    if(!jwt) {
        c.status(401)
        return c.json({ status: 'Unauthorized'})
    }
    try {
        const token = jwt.split(' ')[1]
        const payload = await verify(token, c.env.JWT_SECRET)

        if (!payload) {
            c.status(401)
            return c.json({ status: 'Unauthorized' })
        }
        const userId = payload.id as string
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            c.status(403)
            return c.json({
                message: "User not found"
            })
        }
        return c.json({
            name: user.name,
            email: user.email
        })
    } catch (err) {
        c.status(500)
        return c.json({ error: err })
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    
    const body = await c.req.json()
    const { success } = signinInput.safeParse(body)
    if (!success) {
        c.status(400)
        return c.json({
            error: "invalid input"
        })
    }
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
    const { success } = signupInput.safeParse(body)
    if (!success) {
        c.status(400)
        return c.json({
            error: "invalid input"
        })
    }
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

