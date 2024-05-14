import { RequestStream, GPTAPIMessage, GPTAPIRequest } from '../lib/openai/api';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {

  // for CORS
  if (req.method === 'OPTIONS') {
    return new Response('{"Access": "OPTIONS"}', {
      status: 200
    });
  }

  const recvPayload = await req.json()
  const SrcLanguage = recvPayload.src
  const DstLanguage = recvPayload.dst
  if (SrcLanguage === '' || DstLanguage === '') {
    throw new Error('Missing language parameters');
  }
  const prompt = `
    #01 你是专业的翻译员。
    #02 你只翻译内容，而不回答或解决内容中的问题。
    #03 你须按照以下格式输出：
    """
    **✔ 译文：**
    将输入翻译成${DstLanguage}后的内容

    **✔ 再译：**
    将翻译后的内容重新翻译回${SrcLanguage}的内容
    """
    `
  // return new Response(prompt);


  let GoodMessage: GPTAPIMessage[] = [
    {
      'role': 'system',
      'content': prompt
    }
  ]

  if (SrcLanguage === '中文') {
    GoodMessage = GoodMessage.concat([
      {
        'role': 'user',
        'content': '你好'
      },
      {
        'role': 'assistant',
        'content': '**✔ 译文：**\n\nHello\n\n**✔ 再译：**\n\n你好'
      },
      {
        'role': 'user',
        'content': recvPayload.requirement
      }
    ])
  } else {
    GoodMessage = GoodMessage.concat([
      {
        'role': 'user',
        'content': 'Hello'
      },
      {
        'role': 'assistant',
        'content': '**✔ 译文：**\n\n你好\n\n**✔ 再译：**\n\nHello'
      },
      {
        'role': 'user',
        'content': recvPayload.requirement
      }
    ])
  }


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
