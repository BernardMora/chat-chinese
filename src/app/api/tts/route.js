import { Polly } from "@aws-sdk/client-polly";
import dotenv from "dotenv";

dotenv.config();

const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export async function GET(request) {
  const text = request.nextUrl.searchParams.get("text");
  const speed = request.nextUrl.searchParams.get("speed");

  const synthesizeSpeechParams = {
    Text: `<speak><prosody rate="${speed}%">${text}</prosody></speak>`,
    OutputFormat: "mp3",
    VoiceId: "Zhiyu",
    TextType: "ssml",
  };

  // Initialize the Polly client with credentials
  const pollyClient = new Polly({
    region: "us-east-1",
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  try {
    // Call the synthesizeSpeech API
    const response = await pollyClient.synthesizeSpeech(synthesizeSpeechParams);

    // Convert the audio stream to a Base64 string
    const audioStream = await response.AudioStream.transformToByteArray();
    const audioBase64 = Buffer.from(audioStream).toString("base64");

    // Return the Base64-encoded audio
    return new Response(JSON.stringify({ audio: audioBase64 }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    return new Response(
      JSON.stringify({ error: "Failed to synthesize speech" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
