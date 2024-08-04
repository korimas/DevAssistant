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
2. 发现待办内容：识别用户工作中的待办事项，并将其列出，提醒用户需要完成的任务。  
3. 发现工作中的闪光点：找到用户工作中的亮点和成就，并在周报中突出展示。
# Ouput
你必须按以下markdown表格的格式整理用户的工作内容，并将其发送给用户, 相同项目的工作内容整合到同一行中。
| 项目          | 工作内容                                                                                 | 时长      |
| ----------- | ------------------------------------------------------------------------------------ | ------- |
| 当前工作内容所属的项目 | {{具体完成的工作内容1}}<br>Status: {{工作内容1目前的现状}}<br>{{具体完成的工作内容2}}<br>Status: {{工作内容1目前的现状}} | 整合后的总时长 |
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
