export interface WorkItem {
    id: number;
    project: string;
    workContent: string;
    time: string;
    comments: string;
}

export interface DayWork {
    name: string;
    rows: WorkItem[];
    selected: WorkItem[];
    summary: string;
}


export interface WeeklyWork {
    monday: DayWork;
    tuesday: DayWork;
    wednesday: DayWork;
    thursday: DayWork;
    friday: DayWork;
    saturday: DayWork;
    sunday: DayWork;

    workIndex: number;
}


export const generateDayWork = (name: string): DayWork => ({
    name: name,
    rows: [],
    selected: [],
    summary: '',
});

export const generateWorkItem = (index: number): WorkItem => ({
    id: index,
    project: '',
    workContent: '',
    time: '',
    comments: '',
});

function generateNewWeeklyWork() {
    return {
        monday: generateDayWork('monday'),
        tuesday: generateDayWork('tuesday'),
        wednesday: generateDayWork('wednesday'),
        thursday: generateDayWork('thursday'),
        friday: generateDayWork('friday'),
        saturday: generateDayWork('saturday'),
        sunday: generateDayWork('sunday'),
        workIndex: 0,
    };
}

export function generateWeeklyWork() {
    const weeklyWork = localStorage.getItem('weeklyWork');
    if (weeklyWork) {
        const weeklyWorkObj = JSON.parse(weeklyWork);
        weeklyWorkObj.monday.selected = [];
        weeklyWorkObj.tuesday.selected = [];
        weeklyWorkObj.wednesday.selected = [];
        weeklyWorkObj.thursday.selected = [];
        weeklyWorkObj.friday.selected = [];
        weeklyWorkObj.saturday.selected = [];
        weeklyWorkObj.sunday.selected = [];
        return weeklyWorkObj;
    }
    return generateNewWeeklyWork();
}

function saveToLocalStorage(weeklyWork: WeeklyWork) {
    localStorage.setItem('weeklyWork', JSON.stringify(weeklyWork));
}

export const WEEKLY_WORK = generateWeeklyWork();

export function autoSave() {
    console.log('autoSave');
    saveToLocalStorage(WEEKLY_WORK)
}

export function deleteSelectedWorks(dayWork: DayWork) {
    dayWork.rows = dayWork.rows.filter((row) => !dayWork.selected.includes(row));
    saveToLocalStorage(WEEKLY_WORK)
}

export function addWorkItem(dayWork: DayWork) {
    dayWork.rows.push(generateWorkItem(WEEKLY_WORK.workIndex));
    WEEKLY_WORK.workIndex++;
    saveToLocalStorage(WEEKLY_WORK)
}

export function clearAll(dayWork: DayWork) {
    // WEEKLY_WORK.monday.selected = [];
    // WEEKLY_WORK.tuesday.selected = [];
    // WEEKLY_WORK.wednesday.selected = [];
    // WEEKLY_WORK.thursday.selected = [];
    // WEEKLY_WORK.friday.selected = [];
    // WEEKLY_WORK.saturday.selected = [];
    // WEEKLY_WORK.sunday.selected = [];

    // WEEKLY_WORK.monday.splice(0, WEEKLY_WORK.monday.length);
    // WEEKLY_WORK.tuesday.rows = [];
    // WEEKLY_WORK.wednesday.rows = [];
    // WEEKLY_WORK.thursday.rows = [];
    // WEEKLY_WORK.friday.rows = [];
    // WEEKLY_WORK.saturday.rows = [];
    // WEEKLY_WORK.sunday.rows = [];
    dayWork.rows = [];
    dayWork.selected = [];
    saveToLocalStorage(WEEKLY_WORK)
}

export const WorkColumns = [
    {
        name: 'project',
        required: true,
        label: '项目',
        align: 'left' as const,
        field: 'project',
        // format: (val) => `${val}`,
        headerStyle: 'width: 150px',
    },
    {
        name: 'workContent',
        required: true,
        label: '工作内容',
        align: 'left' as const,
        field: 'workContent',
        // format: (val) => `${val}`,
    },
    {
        name: 'time',
        required: true,
        label: '时长/H',
        align: 'left' as const,
        field: 'time',
        headerStyle: 'width: 100px',
        // format: (val) => `${val}`,
    },
    {
        name: 'comments',
        required: true,
        label: '备注',
        align: 'left' as const,
        field: 'comments',
        // format: (val) => `${val}`,
    },
];