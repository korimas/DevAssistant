
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

function loadSystemPrompt() {
    const tmp = localStorage.getItem('SystemPrompt');
    if (!tmp) {
        return '';
    }
    return tmp;
}

export function saveSystemPrompt(prompt: string) {
    localStorage.setItem('SystemPrompt', prompt);
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

export const Password = loadPassword();
export const SystemPrompt = loadSystemPrompt();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
