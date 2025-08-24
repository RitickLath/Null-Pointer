import { createClient } from "redis";

let redisCLient: any;

export const connectRedis = async () => {
  try {
    redisCLient = createClient();

    redisCLient.on("error", (err:any) => console.log("Redis Client Error", err));

    await redisCLient.connect();
    console.log("Redis Conneted...");
  } catch (error: any) {
    console.log("Error Occured while connecting to Redis.");
  }
};

export const getRedisClient = () => {
  if (!redisCLient) {
    throw new Error("Redis client is not init.");
  }
  return redisCLient;
};
