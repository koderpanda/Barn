export type Id = string | number
export type ColoumnType = {
    title:string;
    id:Id
}

export type Task ={
    taskid:Id,
    coloumnId:Id,
    desc:string
}