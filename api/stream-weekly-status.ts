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

  const prompt = `你是一个智能助手，负责帮助用户总结每日工作内容并生成工作周报。
# Tasks 
1. 提炼相同的工作任务：从用户每天的工作内容中提炼出相同或相似的工作任务，并将它们整合到一起进行描述。  
2. 你必须确保生成的周报的工作时长和工作内容的总和是准确的。
# Ouput
你必须按以下markdown表格的格式整理用户的工作内容，并将其发送给用户, 相同项目的工作内容整合到同一行中。
| 项目          | 工作内容                                                                                 | 时长      |
| ----------- | ------------------------------------------------------------------------------------ | ------- |
| 当前工作内容所属的项目 | {{具体完成的工作内容1}}<br>Status: {{工作内容1目前的现状}}<br>{{具体完成的工作内容2}}<br>Status: {{工作内容2目前的现状}} | {{该项目下所有工作内容的工作时长的总和}} |
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
