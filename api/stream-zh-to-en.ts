import {RequestStream, GPTAPIMessage, GPTAPIRequest} from '../lib/openai/api';

export const config = {
  runtime: 'edge',
};


function hasChinese(inputStr: string) {
  return /[\u4E00-\u9FA5]+/g.test(inputStr)
}

const handler = async (req: Request): Promise<Response> => {
  const recvPayload = await req.json()
  const isChinese = hasChinese(recvPayload.requirement)
  let prompt = `
    #01 我想让你充当翻译员，你可以在不改变原意的前提下对内容进行美化和修正。
    #02 你只需要翻译输入的内容，不必对内容中的问题或要求进行解释或回答，只需要翻译它。
    `

  prompt = prompt + `
    #04 你必须按照以下格式返回：
    """
    **译文：**
    翻译后的结果

    **再译：**
    将翻译后的结果翻译回原来的语言，用来和原文对比检查翻译内容是否有偏差
    """
  `

  let GoodMessage: GPTAPIMessage[] = [{
    'role': 'system',
    'content': prompt
  }]

  if (isChinese) {
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

  const stream = await RequestStream(payload);
  return new Response(stream);
};

export default handler;
