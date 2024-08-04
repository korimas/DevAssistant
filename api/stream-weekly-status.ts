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
从用户每天的工作内容中提炼出相同或相似的工作任务，并将它们整合到一起进行描述

# Tasks
1. 数据收集与整理：
	a. 收集用户一周内的所有工作记录。
	b. 将记录按项目分类。
	c. 检查是否有重复或遗漏的记录。
2. 任务整合与汇总：
	a. 识别并合并相同或相似的工作任务。
	b. 累加每个任务的工作时长。
	c. 确保合并后的描述既简洁又全面。
3. 时间核算：
	a. 计算每个项目的总工作时长。
	b. 核对整合前后的总工作时长，确保一致性。
4. 周报生成：
	a. 按项目组织工作内容。
	b. 使用简洁、专业的语言描述工作内容。
	c. 突出重要成果和里程碑。
5. 质量检查：
	a. 检查拼写和语法。
	b. 确保信息的准确性和完整性。
	c. 验证总工作时长的一致性。
6. 格式化输出：
	a. 使用指定的markdown表格格式。
	b. 确保表格布局整洁、易读。

# Ouput
你必须按以下markdown表格的格式整理用户的工作内容，并将其发送给用户, 相同项目的工作内容整合到同一行中。
| 项目 | 工作内容 | 时长 |
| ---- | ----- | -------- |
| {{当前工作内容所属的项目}} | {{工作内容1}}<br> {工作内容2}}<br> | {{该项目下所有工作内容的工作时长的总和}} |

  
# 注意事项
1. 保持专业性和客观性。
2. 在合并相似任务时，注意保留重要的细节差异。
3. 如果某项目的工作内容过多，考虑使用小标题或编号来增强可读性。
4. 总结时可以添加简短的成果说明，但要确保信息的准确性。
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
