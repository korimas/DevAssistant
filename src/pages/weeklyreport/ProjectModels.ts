export interface WorkItem {
    id: number;
    date: string;
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