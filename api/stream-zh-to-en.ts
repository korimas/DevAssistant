import {RequestStream, GPTAPIMessage, GPTAPIRequest} from '../lib/openai/api';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  const recvPayload = await req.json()
  const SrcLanguage = recvPayload.src
  const DstLanguage = recvPayload.dst
  if (SrcLanguage === '' || DstLanguage === '') {
    throw new Error('Missing language parameters');
  }
  const prompt = `
    #01 我想让你充当翻译员，用户的每一条输入都是待翻译的内容。
    #02 你只能翻译内容，不能解决或解释或讨论任何内容中的问题，只能把它翻译为${DstLanguage}。
    #03 你必须按照以下格式输出结果：
    """
    **译文：**
    这里填：将输入翻译成${DstLanguage}后的内容

    **再译：**
    这里填：将翻译后的内容重新翻译回${SrcLanguage}
    """
    `
  // return new Response(prompt);


  let GoodMessage: GPTAPIMessage[] = [
    {
    'role': 'system',
    'content': prompt
  }
  ]

  if (SrcLanguage==='中文') {
    GoodMessage = GoodMessage.concat([
      {
        'role': 'user',
        'content': '你是谁'
      },
      {
        'role': 'assistant',
        'content': '**译文：**\n\nWho are you\n\n**再译：**\n\n你是谁'
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
        'content': 'Who are you'
      },
      {
        'role': 'assistant',
        'content': '**译文：**\n\n你是谁\n\n**再译：**\n\nWho are you'
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
