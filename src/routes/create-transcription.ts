import { FastifyInstance } from "fastify";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { z } from "zod";
import { prisma } from "../lib/prima";
import { createReadStream } from "node:fs";
import { openai } from "../lib/openai";

const pump = promisify(pipeline);

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post("/videos/:videoId/transcription", async (req, reply) => {
    const paramsSchema = z.object({ videoId: z.string().uuid() });
    const bodySchema = z.object({ prompt: z.string() });

    const { videoId } = paramsSchema.parse(req.params);
    const { prompt } = bodySchema.parse(req.body);

    const video = await prisma.video.findFirstOrThrow({
      where: { id: videoId },
    });
    const videoPath = video.path;

    const audioReadStream = createReadStream(videoPath);
    console.log("started");
    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      response_format: "json",
      language: "pt",
      temperature: 0,
      prompt,
    });

    await prisma.video.update({
      where: { id: videoId },
      data: { transcription: response.text },
    });

    return reply.send({
      success: true,
      transcription: response.text,
    });
  });
}
