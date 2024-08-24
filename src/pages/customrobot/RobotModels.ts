function loadSystemPrompt() {
    const tmp = localStorage.getItem('SystemPrompt');
    console.log('loadSystemPrompt', tmp);
    if (!tmp) {
        return '';
    }
    return tmp;
}

export function saveSystemPrompt(prompt: string) {
    console.log('saveSystemPrompt', prompt);
    localStorage.setItem('SystemPrompt', prompt);
}

export const SystemPrompt = loadSystemPrompt();
