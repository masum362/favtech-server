import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ServerApiVersion } from "mongodb";

const url = process.env.MONGODBURL;
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("ProductHunt");
const usersCollection = db.collection("users");


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("ProductHunt").command({ ping: 1 });
    console.log("successfully connected database");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export {
  usersCollection,

};

export default run;
