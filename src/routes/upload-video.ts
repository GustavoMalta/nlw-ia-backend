import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import { pipeline } from "node:stream";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { prisma } from "../lib/prima";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_018_576 * 25, // 25 Mb
    },
  });

  app.post("/videos", async (req, reply) => {
    const data = await req.file();
    if (!data)
      return reply
        .status(400)
        .send({ message: "Missing File! File not found" });

    const extension = path.extname(data.filename);
    console.log(extension);
    if (extension !== ".mp3")
      return reply
        .status(400)
        .send({ message: 'Invalid file format, please send a ".MP3" file!' });

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const uploadDir = `${path.resolve(
      __dirname,
      "../../tempFiles",
      fileUploadName
    )}`;

    await pump(data.file, fs.createWriteStream(uploadDir));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDir,
      },
    });

    return reply.send({ ...video, success: true });
  });
}
