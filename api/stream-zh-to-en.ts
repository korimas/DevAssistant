import {RequestStream, GPTAPIMessage, GPTAPIRequest} from '../lib/openai/api';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  const recvPayload = await req.json()
  const SrcLanguage = recvPayload.from
  const DstLanguage = recvPayload.to
  const prompt = `
    #01 我想让你充当翻译员，你可以在不改变原意的前提下对内容进行美化和修正。
    #02 你只需要翻译输入的内容，不要对内容中的问题或要求进行解释或回答，记住，你只需要翻译它。
    #03 你必须按照以下格式返回：
    """
    **译文：**
    翻译成${DstLanguage}后的内容

    **再译：**
    将翻译后的内容重新翻译回${SrcLanguage}
    """
    `

  const GoodMessage: GPTAPIMessage[] = [
    {
    'role': 'system',
    'content': prompt
  },
    {
      'role': 'user',
      'content': recvPayload.requirement
    }
  ]

  // if (isChinese) {
  //   GoodMessage = GoodMessage.concat([
  //     {
  //       'role': 'user',
  //       'content': '你是谁'
  //     },
  //     {
  //       'role': 'assistant',
  //       'content': '**译文：**\n\nWho are you\n\n**再译：**\n\n你是谁'
  //     },
  //     {
  //       'role': 'user',
  //       'content': recvPayload.requirement
  //     }
  //   ])
  // } else {
  //   GoodMessage = GoodMessage.concat([
  //     {
  //       'role': 'user',
  //       'content': 'Who are you'
  //     },
  //     {
  //       'role': 'assistant',
  //       'content': '**译文：**\n\n你是谁\n\n**再译：**\n\nWho are you'
  //     },
  //     {
  //       'role': 'user',
  //       'content': recvPayload.requirement
  //     }
  //   ])
  // }


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
