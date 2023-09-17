import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prima";
import { z } from "zod";

export async function getallVideosRoute(app: FastifyInstance) {
  app.get("/videos", async () => {
    const videos = await prisma.video.findMany({
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return videos;
  });
  app.get("/videos/:videoId", async (req) => {
    const paramsSchema = z.object({ videoId: z.string().uuid() });

    const { videoId } = paramsSchema.parse(req.params);

    const videos = await prisma.video.findFirstOrThrow({
      select: { id: true, name: true, transcription: true, createdAt: true },
      where: { id: videoId },
    });
    return videos;
  });
}
