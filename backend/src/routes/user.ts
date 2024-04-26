import { Hono } from "hono";
import {PrismaClient} from "@prisma/client/edge"
import {withAccelerate} from "@prisma/extension-accelerate"
import {decode,verify,sign, jwt} from "hono/jwt"
import { signupInput,signinInput } from "@dhruvbandi/blogium-common";


export const userRoute= new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string,
    }
  }>()


  
  userRoute.post('/signup', async (c) => {
      const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
      }).$extends(withAccelerate());
      const body = await c.req.json();
      const {success} = signupInput.safeParse(body)
      if(!success){
        c.status(411);
        return c.json({message:"Inputs not correct"})
      }
      try {
          const user = await prisma.user.create({
              data: {
                  name: body.name,
                  email: body.email,
                  password: body.password
              }
          });
          const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
          return c.json({ token:jwt });
      } catch(e) {
          c.status(400);
      console.log(e)
          return c.json({ error: "error while signing up" });
      }
  })
  
  userRoute.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	const body = await c.req.json();
    const {success} = signinInput.safeParse(body)
      if(!success){
        c.status(411);
        return c.json({message:"Inputs not correct"})
      }
  try{

    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });
    
    if (!user) {
      c.status(400);
      return c.json({ error: "user not found" });
    }
    
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ token:jwt });
  }catch(e){
    console.log(e);
    c.status(411);
    return c.text("Invalid");
  }
})
