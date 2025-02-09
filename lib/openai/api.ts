import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

export type ChatGPTAgent = 'user' | 'system' | 'assistant'

export interface GPTAPIMessage {
  role: ChatGPTAgent
  content: string
}

export interface GPTAPIRequest {
  model: string
  messages: GPTAPIMessage[]
  temperature: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  max_tokens?: number
  stream: boolean
  n?: number
}


export async function RequestStream(payload: GPTAPIRequest) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI')
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let counter = 0

  // default to OpenAI
  let API_KEY = process.env.OPENAI_API_KEY
  let API_URL = 'https://api.openai.com/v1/chat/completions'
  let provider = 'openai'

  if (payload.model.startsWith('deepseek')) {
    API_KEY = process.env.DEEPSEEK_API_KEY || ''
    API_URL = 'https://api.deepseek.com/chat/completions'
    provider = 'deepseek'
  } else if (payload.model.startsWith('gemini')) {
    API_KEY = process.env.GEMINI_API_KEY || ''
    API_URL = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`
    provider = 'google'
  }

  // generate header
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  }

  // generate payload
  let body = JSON.stringify(payload)

  const res = await fetch(API_URL, {
    headers: headers,
    method: 'POST',
    body: body,
  })

  if (!res.ok) {
    console.error('Failed to fetch from OpenAI:', res.status, res.statusText)
    throw new Error(`Failed to fetch from OpenAI: ${res.status} ${res.statusText}`)
  }

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return
            }
            const queue = encoder.encode(text)
            controller.enqueue(queue)
            counter++
          } catch (e) {
            // maybe parse error
            controller.error(e)
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse)
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return stream
}
