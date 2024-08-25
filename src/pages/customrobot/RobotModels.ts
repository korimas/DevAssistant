function loadSystemPrompt() {
    const tmp = localStorage.getItem('SystemPrompt');
    // console.log('loadSystemPrompt', tmp);
    if (!tmp) {
        return '';
    }
    return tmp;
}

export function saveSystemPrompt(prompt: string) {
    // console.log('saveSystemPrompt', prompt);
    localStorage.setItem('SystemPrompt', prompt);
}


function loadPassword() {
    const tmp = localStorage.getItem('Password');
    // console.log('loadPassword', tmp);
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
