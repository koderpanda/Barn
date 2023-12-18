import PlusIcon from "@/assets/PlusIcon"
import { Button } from "./ui/button"
import { useMemo, useState } from "react"
import { ColoumnType, Id, Task } from "@/types"
import ColContainer from "./ColContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskContainer from "./TaskContainer";


function KanbanBoard() {
    const [columns, setColoumns] = useState<ColoumnType[]>([]);
    const [activeCol, setActiveCol] = useState<ColoumnType | null>(null)
    const coloumnsId = useMemo(()=>columns.map((col)=>{return col.id}),[columns])
    const [tasks,setTask] = useState<Task[]>([])
    const [activeTask, setactiveTask] = useState<Task | null>(null)


    const sensor = useSensors(
        useSensor(PointerSensor,{activationConstraint:{distance:3}})
    )

    const createColoumn = () => {
        const colNew: ColoumnType = {
            id: `${Math.floor(Math.random() * 100000)}`,
            title: `Coloumn ${columns.length}`
        };
        setColoumns([...columns, colNew])
    }

    const createTask = (Col:ColoumnType) => {
        const taskNew: Task = {
            taskid: `${Math.floor(Math.random() * 100000)}`,
            desc: `New Task`,
            coloumnId: Col.id
        };
        setTask([...tasks, taskNew])
    }

    const deleteColoumn=(id:Id)=>{
        const filteredColumns = columns.filter((col)=>{return col.id !==id});
        setColoumns(filteredColumns);
        const newtask = tasks.filter((task)=>{task.coloumnId != id})
        setTask(newtask)
    }

    const updColTitle=(id:Id, updatedValue:string)=>{
        const colIndex = columns.findIndex((col)=> col.id ==id)
        columns[colIndex].title=updatedValue
        setColoumns(columns)
    }

    const updTaskTitle=(task:Task, updatedValue:string)=>{
        const taskIndex = tasks.findIndex((tsk)=> tsk.taskid ==task.taskid)
        tasks[taskIndex].desc=updatedValue
        setTask(tasks)
    }

    const deleteTask=(id:Id)=>{
        const filteredColumns = tasks.filter((task)=>{return task.taskid !==id});
        setTask(filteredColumns);
    }

    const dragStart=(event:DragStartEvent)=>{
        if (event.active.data.current?.type === "Coloumn"){
            setActiveCol(event.active.data.current.col)
        } else if(event.active.data.current?.type === "Task"){
            setactiveTask(event.active.data.current.task)
        }
        return

    }

    const dragEnd=(event:DragEndEvent)=>{
        
        setActiveCol(null)
        setactiveTask(null)
        const {active, over}= event
        if (!over || active.id === over.id) return
        setColoumns((columns)=>{
            const activeColIndex = columns.findIndex((col)=> col.id ==active.id)
            const overColIndex = columns.findIndex((col)=> col.id ==over.id)
            return (arrayMove(columns,activeColIndex,overColIndex))
        })       
    }

    const onDragOver=(event:DragOverEvent)=>{
        if (!activeTask) return
        console.log(event)
        const {active, over}= event
        if (!over || active.id === over.id) return
        //Moving tasks in the same Coloumn or other coloumn but on another task
        if(active.data.current?.type === "Task" && over.data.current?.type === "Task"){
            setTask((tasks)=>{
            const activeTaskIndex = tasks.findIndex((task)=> task.taskid ==active.id)
            const overTaskIndex = tasks.findIndex((task)=> task.taskid ==over.id)
            tasks[activeTaskIndex].coloumnId = tasks[overTaskIndex].coloumnId
            return (arrayMove(tasks,activeTaskIndex,overTaskIndex))
            })
        }
        const isOveraColoumn =  over.data.current?.type === "Coloumn"

        if (isOveraColoumn && activeTask){
            setTask((tasks)=>{
                const activeTaskIndex = tasks.findIndex((task)=> task.taskid ==active.id)
                tasks[activeTaskIndex].coloumnId = over.id
                return (arrayMove(tasks,activeTaskIndex,activeTaskIndex))
                })

        }
}

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">
            <DndContext 
                sensors={sensor} 
                onDragStart={dragStart} 
                onDragEnd={dragEnd}
                onDragOver={onDragOver}>

            <div className="m-auto flex gap-2">
                    <div className="flex gap-4 px-16">
                        <SortableContext items={coloumnsId}>
                         {columns.map((colItem) => {
                        return (<ColContainer key={colItem.id} tasks={tasks.filter((task)=>{return task.coloumnId===colItem.id})} col={colItem} deleteColoumn={deleteColoumn} updColTitle={updColTitle} createTask={createTask} deleteTask={deleteTask} updTaskTitle={updTaskTitle}/>)
                    })}</SortableContext>
                    </div>
                <Button className=" gap-3 w-[250px] border-columnBackgroundColor bg-mainBackgroundColor  border-2 rounded-xl p-4 ring-rose-500 hover:ring-2" onClick={() => createColoumn()}>Add Coloumn <PlusIcon /></Button>
            </div>
            {createPortal(<DragOverlay>
                {activeCol && (<ColContainer tasks={tasks.filter((task)=>{return task.coloumnId===activeCol.id})}  col={activeCol} deleteColoumn={deleteColoumn} updColTitle={updColTitle} createTask={createTask} deleteTask={deleteTask} updTaskTitle={updTaskTitle}/>
                )}
                {activeTask && (<TaskContainer task={activeTask} deleteTask={deleteTask} updTaskTitle={updTaskTitle}  />)}
            </DragOverlay>,document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard