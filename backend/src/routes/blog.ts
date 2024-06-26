
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "@vikashrock45/bloggr-common";

export const blogRouter = new Hono<{
    Bindings: {
        JWT_SECRET: string,
        DATABASE_URL: string
    },
    Variables: {
        userId: string
    }
}>()

blogRouter.use('/', async (c, next) => {
    const jwt = c.req.header('Authorization')
    if(!jwt) {
        c.status(401)
        return c.json({ status: 'Unauthorized'})
    }

    const token = jwt.split(' ')[1]
    const payload = await verify(token, c.env.JWT_SECRET)

    if (!payload) {
        c.status(401)
        return c.json({ status: 'Unauthorized' })
    }
    c.set('userId', payload.id as string)
    await next();
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const body = await c.req.json()
    const { success } = createPostInput.safeParse(body)
    if (!success) {
        c.status(400)
        return c.json({
            error: "invalid input"
        })
    }
    const userId = c.get('userId')
    try {
        const post = await prisma.blog.findFirst({
            where: {
                title: body.title,
                content: body.content,
            }
        })
        if (!post) {
            const res = await prisma.blog.create({
                data: {
                    title: body.title,
                    content: body.content,
                    authorId: userId
                }
            })
            return c.json({
                id: res.id
            })
        }
        return c.json({
            message: "Same blog is already published"
        })
    } catch(err) {
        console.log("Error creating new blog:", err)
        return c.json({
            err: "Error putting data into database"
        })
    }
})

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const body = await c.req.json()
    const { success } = updatePostInput.safeParse(body)
    if (!success) {
        c.status(400)
        return c.json({
            error: "invalid input"
        })
    }
    try {
        await prisma.blog.updateMany({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content
            }
        })
        return c.json({
            message: "Successfully updated"
        })
    } catch(err) {
        console.log("Error updating content:", err)
        return c.json({
            error: 'Error updating posts: '
        })
    }
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const posts = await prisma.blog.findMany({
        include: {
            author: true,
        },
    })
    return c.json({
        posts
    })
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const id = c.req.param('id')
    try {
        const post = await prisma.blog.findUnique({
            where: {
                id
            }
        })
        return c.json({
            post 
        })
    } catch (err) {
        c.json({
            error: "Something went wrong: " + err
        })
    }
})