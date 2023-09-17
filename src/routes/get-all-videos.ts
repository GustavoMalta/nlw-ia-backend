import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prima";

export async function getallVideosRoute(app: FastifyInstance) {
  app.get("/videos", async () => {
    const videos = await prisma.video.findMany();
    return videos;
  });
}
