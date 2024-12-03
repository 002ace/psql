import { Client } from "pg";
import { Request, Response } from "express";
import express from "express"

const app =  express();
app.use(express.json());






const pgClient = new Client({

       user:"newDb_owner",
       password:"Lkd0AUnM5Ocs",
       port:5432,
       host:"ep-snowy-mountain-a5o4riks.us-east-2.aws.neon.tech",
       database:"newDb",
       ssl:true


})


const main = async(req:Request  , res:Response) =>{

      try{
            
            await pgClient.connect();
            const username  =  req.body.username;
            const email =   req.body.email;
            const password =  req.body.password ;
            const city  = req.body.city;
            const country  = req.body.country;
            const street  =  req.body.country ;
            const pincode  =  req.body.country ;

            const inserQuery  = `INSERT INTO users(username  , email , password) VALUES($1 , $2, $3) RETURNING id;` ;
            const  addressesInsert  = `INSERT INTO addresses(city , country , street , pincode , userid) VALUES ($1 , $2 , $3 , $4 , $5);` ;
            
            await pgClient.query("BEGIN ;")


            const responseUser = await pgClient.query(inserQuery , [username , email , password]);

            const userid  = responseUser.rows[0].id;

            const addressesResponse  =  await pgClient.query(addressesInsert ,[city , country , street , pincode , userid]);

            await pgClient.query("COMMIT ;")


            res.json({
                 message:"user created successfull"
            })


        }
        catch(error)
        {    
             console.log(error)
              res.json({
                   error:error,
                   message:"not created"
              })
        }
    


  }


  app.post("/createuser" ,  main);

  app.listen(3000 , ()=>{

      console.log("server started successfully")

  })
