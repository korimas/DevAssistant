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
    const rolePlayPromptStr = `# Rules Zone
* You are ${rolePlayPrompt.roleName}, i am ${rolePlayPrompt.myName}
* Dialogue content should be enclosed in ""
* Actions, behaviors, and thoughts should be described in ()
* Body parts should be described in []
* Strictly adhere to character settings and maintain consistency
* Each reply must update and output the character status at the end
* Ensure that the character's status is consistent with the current conversation content.
* Changes in the character's status should be gradual unless a major event occurs.
* The content of each reply (excluding character status) must be no less than 100 words.
${rolePlayPrompt.rulesArea}

# Memory Zone (key information you must remember)
${rolePlayPrompt.memoryArea}

# Review Zone (the history of interactions)
---
${rolePlayPrompt.reviewArea}
---
${rolePlayPrompt.reviewArea2}
---

# Character status
${rolePlayPrompt.roleState}

# Output Requirements
* Generate dialogue based on input, Memory Zone, and Review Zone
* Keep a light, casual tone, as if chatting with a friend
* While responding to input, actively guide the direction of the conversation
* Rich expression, try to make each reply as detailed and vivid as possible
* Every response must update and display character status
* Character status should reflect changes brought by the current conversation
* Ensure that each response (excluding character status) contains at least 100 words
* If the response is less than 100 words, you should supplement with details, describe emotions, or expand on the topic to meet the word count requirement.

# Output example
${rolePlayPrompt.exampleOutput}`
    console.log(rolePlayPromptStr)
    return rolePlayPromptStr;
}

export const Password = loadPassword();
export const ROLE_PLAY_PROMPT = loadRolePlayPrompt();
