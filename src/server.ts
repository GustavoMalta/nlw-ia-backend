import fastfy from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAiCompletionRoute } from "./routes/generate-ai-completion";
import { getallVideosRoute } from "./routes/get-all-videos";

const app = fastfy();

app.register(fastifyCors, {
  origin: "*",
});

app.get("/ping", () => {
  return "pong";
});

app.register(getAllPromptsRoute);
app.register(getallVideosRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateAiCompletionRoute);

app
  .listen({ port: 3333 })
  .then(() => console.log(">>>>>> Server Running in port 3333 <<<<<<"));
