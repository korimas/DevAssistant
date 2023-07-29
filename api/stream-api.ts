import {RequestStream, GPTAPIMessage, GPTAPIRequest} from '../lib/openai/api';

export const config = {
    runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
    const recvPayload = await req.json()

    const GoodMessage: GPTAPIMessage[] = [
      {
        'role': 'user',
        'content': recvPayload.question
      }
    ]

  const defaultModel = process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo'

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
