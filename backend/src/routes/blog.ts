import { Hono } from 'hono'
import {PrismaClient} from "@prisma/client/edge"
import {withAccelerate} from "@prisma/extension-accelerate"
import {verify} from "hono/jwt"
import { createBlogInput,updateBlogInput } from '@dhruvbandi/blogium-common'

export const blogRoute = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string,
  },
  Variables:{
    userId:string
  }
}>();

//TODO -> MAKE A REUSABLE COMPONENT FOR GETBYID SO THAT CODE REDUNDANCY REDUCES

blogRoute.use("/*",async(c,next)=>{
    const header =c.req.header("authorization") || "";
    const token = header.split(" ")[1]
    try{

        const response = await verify(token,c.env.JWT_SECRET) ;
        if(response.id){
            c.set("userId",response.id);
            await next()
        }
        else{
            c.status(403)
            return c.json({error:"unauthorized"})
        }
    }
    catch(e){
        c.status(403);
        return c.json({message:"you are not logged in"});
    }
  })

blogRoute.post("/",async(c)=>{
    const userId = c.get('userId');
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({message:"Inputs are not correct"})
    }
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

   const blog= await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            tags:body.tags,
            authorId:userId
        }
    }) 
    const returnblog= await prisma.post.findFirst({
        where:{
            id:blog.id
        },
        select:{
            title:true,
            content:true,
            id:true,
            author:{
                select:{
                    name:true,
                    id:true,
                    catchPhrase:true,
                }
            },
            created_at:true,
            updated_at:true,
            tags:true,
        }
    }) 
    return c.json(returnblog)

})

  blogRoute.put("/",async (c)=>{
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({message:"Inputs are not correct"})
    }
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

   const blog= await prisma.post.update({
    where:{
        id:body.id
    },
        data:{
            title:body.title,
            content:body.content,
            tags:body.tags
        }
    }) 
    return c.json({
        id:blog.id
    })
  })
  blogRoute.get("/bulk",async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{

        const blog= await prisma.post.findMany({
            select:{
                content:true,
                title:true,
                author:{
                    select:{
                        name:true,
                        id:true,
                        catchPhrase:true,
                        ProfilePic:true,
                    }
                },
                id:true,
                created_at:true,
                updated_at:true,
                tags:true,
            }
        }) 
        return c.json({
            blog
        })
    }catch(e){
        c.status(411);
        return c.json({message:"Error while fetching blog post"})
    }
  })
  blogRoute.get("/:id",async (c)=>{
    const id=c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{

        const blog= await prisma.post.findFirst({
            where:{
                id:id
            },
            select:{
                title:true,
                content:true,
                id:true,
                author:{
                    select:{
                        name:true,
                        id:true,
                        catchPhrase:true,
                        ProfilePic:true,
                    }
                },
                created_at:true,
                updated_at:true,
                tags:true,
            }
        }) 
        return c.json({
            blog
        })
    }catch(e){
        c.status(411);
        return c.json({message:"Error while fetching blog post"})
    }
  })

  blogRoute.get("/search/:q",async (c)=>{
    const query=c.req.param('q');
    // console.log(query);
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const blogs= await prisma.post.findMany({
            where:{
                OR:[
                    {
                        title:{
                            search:query,
                            contains:query
                        }
                    },
                    {
                        content:{
                            search:query,   
                            contains:query
                        }
                    },
                    {
                        tags:{
                            has:query,
                        }
                    },
                    {
                        author:{
                            name:{
                                search:query,
                                contains:query,
                                startsWith:query
                            }
                        }
                    }
                ]
            },
            select:{
                title:true,
                content:true,
                id:true,
                author:{
                    select:{
                        name:true,
                        id:true,
                        catchPhrase:true,
                        ProfilePic:true,
                    }
                },
                created_at:true,
                updated_at:true,
                tags:true,
            }
        }) 
        return c.json({
            blogs,
        })
    }catch(e){
        c.status(411);
        console.log(e);
        return c.json({message:"Error while searching",error:e})
    }
  })

