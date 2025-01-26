export interface RolePlayPrompt {
    roleName: string;
    myName: string;
    rulesArea: string;
    memoryArea: string;
    roleState: string;
    exampleInput: string;
    exampleOutput: string;
    maxNum: number;
    reviewItems: string[];
    rolePlayConfig: RolePlayConfig;
}

export interface RolePlayConfig {
    enableRoleState: boolean;
}

function loadRolePlayPrompt(): RolePlayPrompt {
    const tmp = localStorage.getItem('RolePlayPrompt');
    if (!tmp) {
        return {
            roleName: "",
            myName: "",
            rulesArea: "",
            memoryArea: "",
            roleState: "",
            exampleInput: "",
            exampleOutput: "",
            maxNum: 1,
            reviewItems: [],
            rolePlayConfig: {
                enableRoleState: true
            }
        };
    }
    const rolePlayPromptObj = JSON.parse(tmp);
    rolePlayPromptObj['maxNum'] = 1;
    if (rolePlayPromptObj['reviewItems'] === null || rolePlayPromptObj['reviewItems'] === undefined) {
        rolePlayPromptObj['reviewItems'] = [];
    }
    if (rolePlayPromptObj['rolePlayConfig'] === null || rolePlayPromptObj['rolePlayConfig'] === undefined) {
        rolePlayPromptObj['rolePlayConfig'] = {
            enableRoleState: true
        };
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

    let rolePlayPromptStr = `
我们即将进行一场角色扮演游戏，你将扮演${rolePlayPrompt.roleName}，我将扮演${rolePlayPrompt.myName}。
在游戏中，我们将通过对话来互动，你需要根据我的回复和你的记忆，继续对话并输出回复。游戏规则如下：

# 规则区（角色扮演过程中必须遵守的规则）
## 符号使用规则
- 对白使用中文引号""
- 动作、行为和心理活动使用圆括号()
- 身体部位描述使用方括号[]
- 符号使用目的：增强表达的层次感和情感细节

## 角色扮演规则
- 保持角色一致性和真实性
- 遵循"show, don't tell"原则（重要）
- 通过细节展现情感和状态
- 保持对话的自然性和即兴性
- 主动引导对话，但不失真实感
- 每次回复须包含丰富的行为动作和身体部位描述，行为和身体描述必须与对话内容紧密相关，真实反映角色情感状态，丰富且有细节感
`
    if (rolePlayPrompt.rolePlayConfig.enableRoleState) {
        rolePlayPromptStr += `- 每次回复必须在最后更新并输出角色状态，角色状态应反映当前对话带来的变化\n`
    }
    rolePlayPromptStr += `${rolePlayPrompt.rulesArea}

# 记忆区（在每次对话中都必须关注的关键信息）

## 重要信息
${rolePlayPrompt.memoryArea}

## 最近的对话
${reviewAreaStr}

`
    if (rolePlayPrompt.rolePlayConfig.enableRoleState) {
        rolePlayPromptStr += `## 角色状态\n${rolePlayPrompt.roleState}\n`
    }

    if (rolePlayPrompt.exampleInput !== null && rolePlayPrompt.exampleInput !== '') {
        rolePlayPromptStr += `
# 输出示例
${rolePlayPrompt.exampleOutput} `
    }

    rolePlayPromptStr += `
我们开始吧，下面我会对你说：`

    console.log(rolePlayPromptStr)
    return rolePlayPromptStr;
}

export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
