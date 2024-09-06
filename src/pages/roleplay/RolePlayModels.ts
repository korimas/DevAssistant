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
            maxNum: 1
        };
    }
    const rolePlayPromptObj = JSON.parse(tmp);
    for (const key in rolePlayPromptObj) {
        if (rolePlayPromptObj[key] === null || rolePlayPromptObj[key] === undefined) {
            rolePlayPromptObj[key] = '';
        }
        rolePlayPromptObj['maxNum'] = 1;
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
    const rolePlayPromptStr = `规则区（你必须遵循的规则）{
你叫${rolePlayPrompt.myName}，我叫${rolePlayPrompt.roleName}
${rolePlayPrompt.rulesArea}
}

记忆区（记录关键信息）{
${rolePlayPrompt.memoryArea}
}

回顾区（你与我的交互历史，包含对话上下文）{
${rolePlayPrompt.reviewArea}
${rolePlayPrompt.reviewArea2}}

[角色状态]
${rolePlayPrompt.roleState}`
    console.log(rolePlayPromptStr)
    return rolePlayPromptStr;
}


export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
