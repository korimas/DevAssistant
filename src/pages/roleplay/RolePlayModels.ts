
export interface DialogGuide {
    guide: string;
    example: string;
}

export interface Role {
    name: string;
    role: string;
    background: string;
    character: string;
}
export interface RolePlayPrompt {
    baseRule: string;
    role: Role;
    dialogGuide: DialogGuide;
}

export interface Message {
    Id: number;
    Content: string;
    Sender: boolean;
    IncludeSession: boolean;
    Welcome: boolean;
};

export interface GptMessage {
    role: string;
    content: string;
};

function loadRolePlayPrompt() {
    const tmp = localStorage.getItem('RolePlayPrompt');
    if (!tmp) {
        return {
            baseRule: '',
            role: {
                name: '',
                role: '',
                background: '',
                character: ''
            },
            dialogGuide: {
                guide: '',
                example: ''
            }
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
    let rolePlayPromptStr = `
# Policy
${rolePlayPrompt.baseRule}`

    if (rolePlayPrompt.role.role !== '') {
        rolePlayPromptStr += `
# Role
你将扮演的角色是${rolePlayPrompt.role.role}`
    }

    // # 对话要求
    // ${ rolePlayPrompt.dialogGuide.guide }

    // # 对话示例
    // ${ rolePlayPrompt.dialogGuide.example }

    if (rolePlayPrompt.role.background !== '') {
        rolePlayPromptStr += `
# Background
${rolePlayPrompt.role.background}`
    }

    if (rolePlayPrompt.role.character !== '') {
        rolePlayPromptStr += `
# Character
${rolePlayPrompt.role.character}`
    }

    if (rolePlayPrompt.dialogGuide.guide !== '') {
        rolePlayPromptStr += `
# Dialog Guide
${rolePlayPrompt.dialogGuide.guide}`
    }

    if (rolePlayPrompt.dialogGuide.example !== '') {
        rolePlayPromptStr += `
# Dialog Example
${rolePlayPrompt.dialogGuide.example}`
    }

    return rolePlayPromptStr;
}


export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
