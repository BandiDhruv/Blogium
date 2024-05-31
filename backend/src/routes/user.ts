import { Hono } from "hono";
import {PrismaClient} from "@prisma/client/edge"
import {withAccelerate} from "@prisma/extension-accelerate"
import {decode,verify,sign, jwt} from "hono/jwt"
import { signupInput,signinInput } from "@dhruvbandi/blogium-common";
import { S3Client,PutObjectCommand,ObjectCannedACL } from "@aws-sdk/client-s3";
import { HonoS3Storage } from "@hono-storage/s3";


export const userRoute= new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string,
      AWS_ACCESS_KEY_ID:string,
      AWS_SECRET_ACCESS_KEY:string,
    }
  }>()
  const BUCKET_NAME="myblogiumbk1";
  const client = (accessKeyId: string, secretAccessKey: string) =>
    new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const storage = new HonoS3Storage({
      key: (_, file) =>
        `${file.originalname}-${new Date().getTime()}.${file.extension}`,
      bucket: BUCKET_NAME,
      client: (c) => client(c.env.AWS_ACCESS_KEY_ID, c.env.AWS_SECRET_ACCESS_KEY),
    });

  userRoute.get('/getUser',async(c)=>{
    const header =c.req.header("authorization") || "";
    const token = header && header.split(" ")[1]
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    try{
      const response=await verify(token,c.env.JWT_SECRET)
      if(response){
        c.status(200);
        const userData=await prisma.user.findUnique({where:{id:response.id},})
        // console.log(userData)
        if(userData){ 
          c.status(200)
          return c.json({message:"user retrieved successfully",data:userData})
        }
        else return c.json("cannot retrieve user");
      }
      else {
        c.status(411)
        return c.json({message:"forbidden"})
      }
    }catch(e){
        c.status(403);
        return c.json({message:"Could Not Veify You"});
    }
  })
  userRoute.post('/update-user',async (c) =>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const body =await c.req.json();
    try{
      const user = await prisma.user.update({
        where : { id : body.id },
        data : { ...body}
      })
      if(!user){
        c.status(400)
        return c.json({message:'No User Found'})
      } 
      c.status(200);
      return c.json({message:"User Details Updated Successfully"});
    }catch(e){
      c.status(400);
      console.log(e);
      return c.json({message:'could not update user now try after sometime'})
    }
  })
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

userRoute.post("/upload-profilePhoto", storage.single("file"), async (c) => {
  const uploadedFile = c.var.files.file;
  const userId = c.req.bodyCache.parsedBody?.userId.toString();

  if (uploadedFile && uploadedFile instanceof File) {
    const s3Client = client(c.env.AWS_ACCESS_KEY_ID, c.env.AWS_SECRET_ACCESS_KEY);

    const params = {
      Bucket: BUCKET_NAME,
      Key: uploadedFile.name,
      Body: uploadedFile.stream(),
      ACL: ObjectCannedACL.public_read 
    };
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());
    try {
      await s3Client.send(new PutObjectCommand(params));

      const uploadedFileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${uploadedFile.name}`;
      const user=await prisma.user.update({
        where:{id:userId },
        data: { ProfilePic: uploadedFileUrl },
      })
      return c.json({ status: "success", user: user});
    } catch (err:any) {
      console.error(err);
      return c.json({ status: "error", message: err.message });
    }
  }
  return c.json({ status: "error", message: "No file uploaded" });
});