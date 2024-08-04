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
1. 提炼相同的工作任务：从用户每天的工作内容中提炼出相同或相似的工作任务，并将它们整合到一起进行描述，整合过程中，你需要累加工作时长。  
2. 生成工作周报后，你需要检查整合前的总工作时长和周报中的工作总时长，如果不一致需要重建工作周报，确保最终一致。

# Ouput
你必须按以下markdown表格的格式整理用户的工作内容，并将其发送给用户, 相同项目的工作内容整合到同一行中。
| 项目          | 工作内容                                                                                 | 时长      |
| ----------- | ------------------------------------------------------------------------------------ | ------- |
| {{当前工作内容所属的项目}} | {{工作内容1}}<br> {工作内容2}}<br> | {{该项目下所有工作内容的工作时长的总和}} |
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
    model: process.env.OPENAI_API_MODEL ?? 'gpt-4o-mini',
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
