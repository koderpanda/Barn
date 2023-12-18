import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { ColoumnType, Id, Task } from "@/types"
import { Button } from "./ui/button"
import DeleteIcon from "@/assets/DeleteIcon"
import { CSS } from '@dnd-kit/utilities'
import { useMemo, useState } from 'react'
import PlusIcon from '@/assets/PlusIcon'
import TaskContainer from './TaskContainer'
import { createPortal } from 'react-dom'
import { DragOverlay } from '@dnd-kit/core'

interface props {
    col: ColoumnType;
    tasks: Task[];
    deleteColoumn: (id: Id) => void;
    updColTitle: (id: Id, updatedValue: string) => void;
    createTask: (col: ColoumnType) => void;
    deleteTask: (id: Id) => void;
    updTaskTitle: (task: Task, updatedValue: string) => void
}
function ColContainer(props: props) {
    const [editMode, SetEditMode] = useState(false)
    const [colTitleValue, SetcolTitleValue] = useState("")

    
    
    const { col, tasks, deleteColoumn, updColTitle, createTask, deleteTask, updTaskTitle } = props

    const TaskIdArrId = useMemo(()=>{return tasks.map((task)=>task.taskid)},[tasks])


    const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
        useSortable({
            id: col.id,
            data: {
                type: "Coloumn",
                col
            },
            disabled: editMode
        })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <div ref={setNodeRef} style={style} className="opacity-60 border border-rose-500 bg-columnBackgroundColor bg-opacity-60 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
        </div>
    }

    return (
        <div ref={setNodeRef} style={style} className=" bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col">
            {/* Coloumn Title */}

            <div {...attributes} {...listeners} onClick={() => { SetEditMode(true); SetcolTitleValue(col.title) }} className="flex justify-between bg-mainBackgroundColor text-xl h-[60px] cursor-grab rounded-lg rounded-b-none p-3 font-bold border-4 border-columnBackgroundColor gap-3 w-full">
                <div className="flex justify-center gap-3">
                    <div className="bg-columnBackgroundColor text-sm flex justify-center items-center px-2 py-1 rounded-full">
                        0</div>
                    <div className='flex text-lg items-center justify-center'>

                        {!editMode && col.title}
                        {editMode && <input
                            className='bg-columnBackgroundColor border-[1px] outline-none border-rose-500 rounded-sm'
                            autoFocus value={colTitleValue}
                            onChange={(e) => { updColTitle(col.id, e.target.value); SetcolTitleValue(e.target.value) }}
                            onBlur={() => { SetEditMode(false) }}
                            onKeyDown={(e) => { if (e.key !== 'Enter') return; SetEditMode(false) }}></input>}
                    </div>
                </div>
                <div className="flex items-center">
                    <Button onClick={() => { deleteColoumn(col.id) }}
                        variant={"ghost"} className="stroke-gray-500 px-2 py-1 hover:stroke-white hover:bg-columnBackgroundColor rounded">
                        <DeleteIcon />
                    </Button>
                </div>

            </div>
            {/* Coloumn Task Container*/}
            <div className='flex flex-col flex-grow overflow-y-auto gap-4 p-2'>
                <SortableContext items={TaskIdArrId}>{
                    tasks.map((task) => {
                            return <TaskContainer key={task.taskid} task={task} deleteTask={deleteTask} updTaskTitle={updTaskTitle} />
                    })}
                </SortableContext>
            </div>
            {/* Coloumn Footer */}
            <div><button onClick={() =>{console.log(col); createTask(col)}} className='flex gap-2 p-4 w-full border-2 rounded-lg border-columnBackgroundColor hover:border-rose-900 hover:bg-mainBackgroundColor outline-none'><PlusIcon /> Add Task</button></div>


        </div>
    )
}

export default ColContainer