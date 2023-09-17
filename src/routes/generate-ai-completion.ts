import { FastifyInstance } from "fastify";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { z } from "zod";
import { prisma } from "../lib/prima";
import { openai } from "../lib/openai";
import { streamToResponse, OpenAIStream } from "ai";

const pump = promisify(pipeline);

export async function generateAiCompletionRoute(app: FastifyInstance) {
  app.post("/ai/complete", async (req, reply) => {
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    const { videoId, prompt, temperature } = bodySchema.parse(req.body);

    const video = await prisma.video.findFirstOrThrow({
      where: { id: videoId },
    });

    if (!video.transcription)
      return reply.status(400).send({ error: "video was not generated yet." });

    const promptMessage = prompt.replace(
      "{transcription}",
      video.transcription
    );
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature,
      messages: [{ role: "user", content: promptMessage }],
      stream: true,
    });

    const stream = OpenAIStream(response);

    streamToResponse(stream, reply.raw, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT",
      },
    });
    // return {
    //   success: true,
    //   response,
    // };
  });
}
