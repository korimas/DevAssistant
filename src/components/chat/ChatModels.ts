export interface Message {
    Id: number;
    Content: string;
    Sender: boolean;
    IncludeSession: boolean;
    Welcome: boolean;
    Pinned: boolean;
};

export interface GptMessage {
    role: string;
    content: string;
};

export interface ChatHistory {
    systemPrompt: string;
    messages: Message[];
}

export interface HistoryRecord {
    timestamp: number;
    inputSummary: string;
    outputSummary: string;
}


export function loadHistorys(): HistoryRecord[] {
    const tmp = localStorage.getItem('Historys');
    if (tmp === null || tmp === 'undefined' || tmp === 'null') {
        return [];
    }
    return JSON.parse(tmp);
}

export function getHistory(record: HistoryRecord): ChatHistory | null {
    const tmp = localStorage.getItem('History_' + record.timestamp);
    if (tmp === null || tmp === 'undefined' || tmp === 'null') {
        return null;
    }
    return JSON.parse(tmp);
}

export function addHistory(historys: HistoryRecord[], record: HistoryRecord, systemPrompt: string, messages: Message[]) {
    localStorage.setItem('Historys', JSON.stringify(historys));
    localStorage.setItem('History_' + record.timestamp, JSON.stringify({
        systemPrompt: systemPrompt,
        messages: messages
    }));
}

export function updateHistory(record: HistoryRecord, systemPrompt: string, messages: Message[]) {
    localStorage.setItem('History_' + record.timestamp, JSON.stringify({
        systemPrompt: systemPrompt,
        messages: messages
    }));
}


export function deleteHistory(historys: HistoryRecord[], record: HistoryRecord) {
    localStorage.removeItem('History_' + record.timestamp);
    historys = historys.filter((item) => item.timestamp !== record.timestamp);
    localStorage.setItem('Historys', JSON.stringify(historys));
    return historys;
}