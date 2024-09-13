export interface RolePlayPrompt {
    roleName: string;
    myName: string;
    rulesArea: string;
    memoryArea: string;
    reviewArea: string;
    reviewArea2: string;
    roleState: string;
    exampleInput: string;
    exampleOutput: string;
    maxNum: number;
    reviewItems: string[];
}

function loadRolePlayPrompt(): RolePlayPrompt {
    const tmp = localStorage.getItem('RolePlayPrompt');
    if (!tmp) {
        return {
            roleName: "",
            myName: "",
            rulesArea: "",
            memoryArea: "",
            reviewArea: "",
            reviewArea2: "",
            roleState: "",
            exampleInput: "",
            exampleOutput: "",
            maxNum: 1,
            reviewItems: [],
        };
    }
    const rolePlayPromptObj = JSON.parse(tmp);
    rolePlayPromptObj['maxNum'] = 1;
    if (rolePlayPromptObj['reviewItems'] === null || rolePlayPromptObj['reviewItems'] === undefined) {
        rolePlayPromptObj['reviewItems'] = [];
    }
    return rolePlayPromptObj;
}

export function saveRolePlayPrompt(rolePlayPrompt: RolePlayPrompt) {
    localStorage.setItem('RolePlayPrompt', JSON.stringify(rolePlayPrompt));
}

function loadPassword() {
    const tmp = localStorage.getItem('Password');
    if (!tmp) {
        return '';
    }
    return tmp;
}

export function savePassword(password: string) {
    localStorage.setItem('Password', password)
}


export function generateRolePlayPromptStr(rolePlayPrompt: RolePlayPrompt) {
    let reviewAreaStr = '';
    for (const item of rolePlayPrompt.reviewItems) {
        reviewAreaStr += item + '\n';
    }

    const rolePlayPromptStr = `# 1. 规则区
- 你是${rolePlayPrompt.roleName}, 我是${rolePlayPrompt.myName}
- 对白使用引号""包裹
- 动作、行为和心理活动使用圆括号()包裹
- 身体部位描述使用方括号[]包裹
- 严格遵守角色设定，保持一致性
- 每次回复必须包含丰富的行为动作和身体部位描述
- 行为动作和身体描述应占回复内容的40%-60%
- 每次回复必须在最后更新并输出角色状态
${rolePlayPrompt.rulesArea}

# 2. 记忆区（记录关键信息）
${rolePlayPrompt.memoryArea}

# 3. 回顾区（记录对话历史）
${reviewAreaStr}

# 4. 输出要求
- 基于输入、记忆区和回顾区生成回复
- 每次回复必须包含多个行为动作和身体部位描述
- 行为和身体描述应与对话内容紧密结合，反映角色的情感和状态
- 保持轻松、随意的语气，如同与朋友聊天
- 回复的同时，主动引导对话方向
- 确保回复内容丰富、生动，但避免冗长或重复
- 每次回复后必须更新并输出角色状态
- 角色状态应反映当前对话带来的变化
- 如果发现即将结束回复但尚未包含角色状态，立即添加它

# 5. 角色状态
${rolePlayPrompt.roleState}

# 6. 输出示例
${rolePlayPrompt.exampleOutput}`
    // console.log(rolePlayPromptStr)
    return rolePlayPromptStr;
}

export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
