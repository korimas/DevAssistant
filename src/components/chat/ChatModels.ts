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

