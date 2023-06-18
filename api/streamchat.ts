import {createParser, ParsedEvent, ReconnectInterval,} from 'eventsource-parser';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
}

export const config = {
    runtime: 'edge',
};

export type ChatGPTAgent = 'user' | 'system' | 'assistant';

export interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}

export interface OpenAIStreamPayload {
    model: string;
    messages: ChatGPTMessage[];
    temperature: number;
    //top_p: number;
    //frequency_penalty: number;
    //presence_penalty: number;
    //max_tokens: number;
    stream: boolean;
    //n: number;
}

async function OpenAIStream(payload: OpenAIStreamPayload) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

    const stream = new ReadableStream({
        async start(controller) {
            // callback
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === 'event') {
                    const data = event.data;
                    // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
                    if (data === '[DONE]') {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || '';
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            // this is a prefix character (i.e., "\n\n"), do nothing
                            return;
                        }
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;
                    } catch (e) {
                        // maybe parse error
                        controller.error(e);
                    }
                }
            }

            // stream response (SSE) from OpenAI may be fragmented into multiple chunks
            // this ensures we properly read chunks and invoke an event for each SSE event stream
            const parser = createParser(onParse);
            // https://web.dev/streams/#asynchronous-iteration
            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });

    return stream;
}

const handler = async (req: Request): Promise<Response> => {
    const recvPayload = await req.json()
    /*
    const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        stream: true,
        n: 1,
    };
    */

  // const token = req.headers.get('Authorization')
  // if (token != 'Bearer ' + process.env.PASSWORD) {
  //       return new Response(JSON.stringify({
  //           success:false,
  //           message: '认证失败！'
  //       }));
  //   }
    const A1 = `概要:
在时间同步功能中，需求是将时间同步的域配置为0，以确保时间同步在特定的域内进行。

详细描述:
时间同步的域需要被配置为0，表示时间同步仅在域0内进行。
配置确保时间同步的范围限定在域0中，防止与其他时间同步域的干扰。

约束和前提条件:
存在支持时间同步的系统或网络设备。
系统或网络设备的硬件和软件设计已经支持时间同步域的配置。

验收标准:
时间同步的域被成功配置为0。
时间同步仅在域0内进行，不会与其他时间同步域产生冲突或干扰。`

    const GoodMessage: ChatGPTMessage[] = [
      {
        'role': 'system',
        'content': '你是一个资深的车载激光雷达软件需求分析工程师，你可以将简单的内容进行合理的扩充并进行软件需求分析，最终输出优秀的软件需求描述。除了进行软件需求分析，你不会回答其他无关的问题。'
      },
      {
        'role': 'user',
        'content': '将以下内容转成软件需求的描述'
      }, {
        'role': 'assistant',
        'content': '请提供具体的内容，我将帮助您将其转化为软件需求的描述。'
      },
      {
        'role': 'user',
        'content': '时间同步的域配置为0'
      }, {
        'role': 'assistant',
        'content': A1
      }, {
        'role': 'user',
        'content': recvPayload.requirement
      }
    ]

    const payload: OpenAIStreamPayload = {
      model: process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo',
      messages: GoodMessage,
      temperature: 0.7,
      //top_p: 1,
      //frequency_penalty: 0,
      //presence_penalty: 0,
      //max_tokens: 200,
      stream: true,
      //n: 1,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
};

export default handler;
