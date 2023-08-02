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
    #01 我想让你充当翻译员。
    #02 你只需要翻译输入的内容，不必对内容中的问题或要求进行解释或回答，只需要翻译它。
    `
  // if (isChinese) {
  //   prompt = prompt + '#03 用户的输入开头会带有"翻译："这几个字，你必须删除这几字后再翻译。'
  // } else {
  //   prompt = prompt + '#03 用户的输入开头会带有"translate:"这几个字，你必须删除这几字后再翻译。'
  // }

  prompt = prompt + `
    #04 你必须以markdown的形式返回并遵照以下格式：
    """
    **译文：**
    翻译后的结果

    **再译：**
    将翻译后的结果翻译回原来的语言
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
