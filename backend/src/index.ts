import { Hono } from 'hono'
import router from './routes/index.ts'


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1', router)

export default app
