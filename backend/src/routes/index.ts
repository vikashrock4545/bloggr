import { Hono } from "hono"
import { userRouter } from "./user.ts"
import { blogRouter } from "./blog.ts"

const router = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

router.route('/user', userRouter)
router.route('/blog', blogRouter)

export default router
