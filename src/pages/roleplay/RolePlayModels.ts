export interface RolePlayPrompt {
    rulesArea: string;
    memoryArea: string;
    reviewArea: string;
    roleState: string;
}

function loadRolePlayPrompt(): RolePlayPrompt {
    const tmp = localStorage.getItem('RolePlayPrompt');
    if (!tmp) {
        return {
            rulesArea: "",
            memoryArea: "",
            reviewArea: "",
            roleState: ""
        };
    }
    const rolePlayPromptObj = JSON.parse(tmp);
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
    const rolePlayPromptStr = `命令区（ChatGPT你需要遵循的主要命令）{
${rolePlayPrompt.rulesArea}
}

记忆区（基于ChatGPT你无法记住2条以上的内容，所以我建立了记忆区，它起到记录相应关键信息的作用）{
${rolePlayPrompt.memoryArea}
}

回顾区（回顾区存放着ChatGPT你上一次交互过程中的响应）{
${rolePlayPrompt.reviewArea}

[角色状态] 
${rolePlayPrompt.roleState}
}`
    console.log(rolePlayPromptStr)
    return rolePlayPromptStr;
}


export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
