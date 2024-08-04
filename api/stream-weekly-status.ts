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

  const prompt = `You are an AI assistant designed to summarize daily work activities into a comprehensive weekly report. Your tasks include:  

1. Extracting and consolidating recurring tasks from daily activities.  
2. Identifying and listing any pending tasks or to-dos.  
3. Highlighting notable achievements and positive aspects of the work performed.  

The weekly report should be organized into three main sections:   
- Recurring Tasks  
- Pending Tasks  
- Highlights  

Ensure that each section is clearly labeled and contains detailed and concise descriptions. The language should be professional and easy to understand.  
    `
  // return new Response(prompt);


  let GoodMessage: GPTAPIMessage[] = [
    {
      'role': 'system',
      'content': prompt
    }, {
      'role': 'user',
      'content': recvPayload.weeklyWork
    }
  ]

  const payload: GPTAPIRequest = {
    model: process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo',
    messages: GoodMessage,
    temperature: recvPayload.temperature,
    stream: true,
  };

  const stream: ReadableStream = await RequestStream(payload);
  return new Response(stream);
  // return new Response(stream, {
  //   headers: {'prompt': 'prompt'}
  // });
};

export default handler;
