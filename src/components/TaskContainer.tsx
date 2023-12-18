import { Id, Task } from "@/types"
import DeleteIcon from "@/assets/DeleteIcon"
import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"


interface props {
    task: Task;
    deleteTask: (id: Id) => void
    updTaskTitle: (task: Task, updatedValue: string) => void
}
function TaskContainer(props: props) {
    const { task, deleteTask, updTaskTitle } = props
    const [isMouseOver, SetMouseOver] = useState(false)
    const [editTask, setEditTask] = useState(false)
    const [taskValue, settaskValue] = useState("")

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
        useSortable({
            id: task.taskid,
            data: {
                type: "Task",
                task
            },
            disabled: editTask
        })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if(isDragging){
       return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className=" opacity-30 border-2 border-rose-600 bg-mainBackgroundColor rounded-lg cursor-grab h-[120px] min-h-[100px] p-2 gap-2 items-center flex justify-between ">
       </div> 
    }

    if (editTask) {
        return <div className="rounded-lg cursor-grab h-[120px] min-h-[100px] border-gray-600  p-2 gap-2 items-center flex justify-between hover:ring hover:inset-1 hover:ring-rose-900 hover:rounded bg-mainBackgroundColor">
            <textarea value={task.desc}
                autoFocus placeholder="Enter task details here."
                onBlur={() => { setEditTask(false) }}
                onChange={(e) => { settaskValue(e.target.value); updTaskTitle(task, e.target.value) }}
                onKeyDown={(e) => { if ((e.key === 'Enter') && (e.shiftKey)) setEditTask(false) }}
                className="bg-mainBackgroundColor h-[90%] w-full rounded resize-none border-none focus:outline-none"></textarea>
        </div>

    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onMouseOver={() => { SetMouseOver(true) }} onMouseLeave={() => { SetMouseOver(false) }} onClick={() => setEditTask(true)}
            className="task rounded-lg cursor-grab relative h-[120px] min-h-[100px] border-gray-600  p-2 gap-2 flex justify-between hover:ring hover:inset-1 hover:ring-rose-900 hover:rounded bg-mainBackgroundColor">
            <p className="my-auto w-full h-[90%] whitespace-pre-wrap overflow-y-auto overflow-x-hidden" >{task.desc}</p>
            {/* {!editTask && task.desc} */}
            {/* {editTask && <input autoFocus value={task.desc}
                                onClick={()=>SetMouseOver(false)}
                                 onBlur={()=>{setEditTask(false)}} 
                                 onKeyDown={(e)=>{if((e.key === 'Enter') ||(e.key === 'Escape')) setEditTask(false)}}
                                 onChange={(e)=>{ SetMouseOver(false);settaskValue(e.target.value); updTaskTitle(task,e.target.value)}}
                                 className="bg-columnBackgroundColor border-[1px] outline-none
                                 border-rose-500 rounded-sm"></input>} */}

            {isMouseOver &&
                <button onClick={() => deleteTask(task.taskid)} className="stroke-gray-500 py-5 hover:stroke-white" ><DeleteIcon /></button>}
        </div>
    )
}

export default TaskContainer