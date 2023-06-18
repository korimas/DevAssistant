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
    const A1 = `标题：
车载以太网PHY主从模式设置

概要:
需求是将车载以太网PHY主从模式设置为从设备（Slave）。这要求PHY模块在车载以太网通信中扮演被动接收数据的角色。

详细描述:
车载以太网PHY模块的通信角色须被设置为从设备，即在车载以太网通信中作为被动接收数据的一方。
车载以太网PHY模块须能够正确识别并遵守主设备发出的指令和控制信号。
车载以太网PHY模块须能够正确接收和处理来自主设备的数据，并根据需求做出相应的响应。
从设备模式下的车载以太网PHY模块须能够与主设备之间建立稳定的通信连接。

约束和前提条件:
车载以太网系统中存在一个或多个主设备，用于控制和与PHY模块进行通信。
车载以太网PHY模块的硬件和软件设计已经支持从设备模式。

验收准则:
在从设备模式下，车载以太网PHY模块能够正确识别和响应来自主设备的指令和控制信号。
车载以太网PHY模块能够正确接收和处理来自主设备的数据，并根据需求做出相应的响应。
从设备模式下的通信连接稳定可靠，能够满足车载以太网系统的性能和可靠性要求。`

    const GoodMessage: ChatGPTMessage[] = [
      {
        'role': 'system',
        'content': '你是一位资深的车载激光雷达产品的软件需求分析工程师，你可以根据提供的内容开展软件需求分析活动，' +
          '将这部分内容转成软件需求的描述。在概要中描述你识别出的真正的软件需求，在详细描述中，' +
          '将识别出来的软件需求进行更具体的描述，主要说清楚谁（软件或功能模块）在什么条件下需要做什么或满足什么。'
      },
      // {
      //   'role': 'user',
      //   'content': '将以下内容转成软件需求的描述'
      // }, {
      //   'role': 'assistant',
      //   'content': '请提供具体的内容，我将帮助您将其转化为软件需求的描述。'
      // },
      {
        'role': 'user',
        'content': '车载以太网PHY的主从模式须设置为Slave模式'
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
