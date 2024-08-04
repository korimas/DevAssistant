import { RequestStream, GPTAPIMessage, GPTAPIRequest } from '../lib/openai/api';

export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1']
};

const handler = async (req: Request): Promise<Response> => {

  // for CORS
  if (req.method === 'OPTIONS') {
    return new Response('{"Access": "OPTIONS"}', {
      status: 200
    });
  }
  const recvPayload = await req.json()

  const GoodMessage: GPTAPIMessage[] = [
    {
      'role': 'user',
      'content': recvPayload.question
    }
  ]

  const defaultModel = process.env.OPENAI_API_MODEL ?? 'gpt-4o-mini'

  const payload: GPTAPIRequest = {
    model: recvPayload.model ?? defaultModel,
    messages: GoodMessage,
    temperature: recvPayload.temperature,
    stream: true,
  };

  const stream = await RequestStream(payload);
  return new Response(stream);
};

export default handler;
