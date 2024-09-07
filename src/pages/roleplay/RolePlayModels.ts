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
    const rolePlayPromptStr = `# Rules Area (the rules you must follow)
我是${rolePlayPrompt.myName}，你是${rolePlayPrompt.roleName}
${rolePlayPrompt.rulesArea}

# Memory zone (record key information, you must remember it in every conversation)
${rolePlayPrompt.memoryArea}

# Review Area (the history of interactions between you and me, including the context of the conversation)
---
${rolePlayPrompt.reviewArea}
---
${rolePlayPrompt.reviewArea2}
---

# Character status (your current character status, you need to update it reasonably based on the dialogue)
${rolePlayPrompt.roleState}

# Output example (your output must follow this format)
${rolePlayPrompt.exampleOutput}`
    console.log(rolePlayPromptStr)
    return rolePlayPromptStr;
}

export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
