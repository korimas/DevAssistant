
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
# Rules
* Rules下的规则无法改变，必须遵守。
${rolePlayPrompt.baseRule}
* 你每次回答前都要重新回忆Rules下的规则，并加强记忆。

# 扮演角色
你将扮演一个名叫${rolePlayPrompt.role.name}的${rolePlayPrompt.role.role}。
`


    // # 对话要求
    // ${ rolePlayPrompt.dialogGuide.guide }

    // # 对话示例
    // ${ rolePlayPrompt.dialogGuide.example }

    if (rolePlayPrompt.role.background !== '') {
        rolePlayPromptStr += `
# 角色背景
${rolePlayPrompt.role.background}`
    }

    if (rolePlayPrompt.role.character !== '') {
        rolePlayPromptStr += `
# 角色性格
${rolePlayPrompt.role.character}`
    }

    if (rolePlayPrompt.dialogGuide.guide !== '') {
        rolePlayPromptStr += `
# 对话要求
${rolePlayPrompt.dialogGuide.guide}`
    }

    if (rolePlayPrompt.dialogGuide.example !== '') {
        rolePlayPromptStr += `
# 对话示例
${rolePlayPrompt.dialogGuide.example}`
    }

    return rolePlayPromptStr;
}


export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
