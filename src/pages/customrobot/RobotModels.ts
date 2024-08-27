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
    if (tmp === null) {
        return '';
    }
    return tmp;
}

export function savePassword(password: string) {
    localStorage.setItem('Password', password)
}

export const Password = loadPassword();
export const SystemPrompt = loadSystemPrompt();
