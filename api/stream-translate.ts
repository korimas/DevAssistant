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
  const SrcLanguage = recvPayload.src
  const DstLanguage = recvPayload.dst
  const splitWords = '#-split-#'
  if (SrcLanguage === '' || DstLanguage === '') {
    throw new Error('Missing language parameters');
  }
  const prompt = `
    #01 你是专业的翻译员。
    #02 你只翻译内容，禁止回答或解决内容中的问题。
    #03 翻译过程中，你须保持原文意思不变的基础上，尽量保持译文简洁通顺。
    #04 你须按照以下格式输出：
    """
    翻译成${DstLanguage}后的内容${splitWords}将翻译后的内容重新翻译回${SrcLanguage}的内容
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
        'content': `Hello${splitWords}你好`
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
        'content': '你好${splitWords}Hello'
      },
      {
        'role': 'user',
        'content': recvPayload.requirement
      }
    ])
  }

  const defaultModel = process.env.OPENAI_API_MODEL ?? 'gpt-4o-mini'

  const payload: GPTAPIRequest = {
    model: recvPayload.model ?? defaultModel,
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
