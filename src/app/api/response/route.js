import openai from "@/lib/singleton";

export async function GET(request) {
  const message = request.nextUrl.searchParams.get("message");
  const completion = await openai.createChatCompletion({
    role: "user",
    content: message,
  });

  const response = completion.choices[0].message;

  return new Response(JSON.stringify({ response: response }), {
    headers: { "Content-Type": "application/json" },
  });
}
