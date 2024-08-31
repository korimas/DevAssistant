function loadSystemPrompt() {
    const tmp = localStorage.getItem('SystemPrompt');
    if (tmp === null || tmp === 'undefined' || tmp === 'null') {
        return '';
    }
    return tmp;
}

export function saveSystemPrompt(prompt: string) {
    localStorage.setItem('SystemPrompt', prompt);
}

export const SystemPrompt = loadSystemPrompt();
