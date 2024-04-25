import { Hono } from 'hono'
import { userRoute } from './routes/user'
import { cors } from 'hono/cors'
import { blogRoute } from './routes/blog'
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string,
  }
}>()
app.use("/api/v1/*",cors());
app.route("api/v1/user",userRoute);
app.route("api/v1/blog",blogRoute);




export default app
