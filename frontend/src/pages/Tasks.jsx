import {useEffect,useState} from "react"

import API from "../api/api"



function Tasks(){

const[tasks,setTasks]=useState([])

const[courses,setCourses]=useState([])

const[form,setForm]=useState({

course_id:"",
title:"",
description:"",
priority:"",
deadline:""

})

useEffect(()=>{

load()

},[])

async function load(){

const t=await API.get("/tasks")

const c=await API.get("/courses")

setTasks(t.data)

setCourses(c.data)

}


async function addTask(e){

e.preventDefault()

await API.post(
"/tasks",
form
)

load()

}


async function completeTask(id){

await API.put(
`/tasks/${id}/complete`
)

load()

}


return(

<>



<div className="page">

<h2>Tasks</h2>

<form
className="form"
onSubmit={addTask}
>

<select

value={form.course_id}

onChange={(e)=>

setForm({

...form,

course_id:e.target.value

})

}

>

<option>

Select Course

</option>

{

courses.map(c=>(

<option
key={c.id}
value={c.id}
>

{c.course_name}

</option>

))

}

</select>


<input

placeholder="Title"

value={form.title}

onChange={(e)=>

setForm({

...form,

title:e.target.value

})

}

/>


<input

placeholder="Description"

value={form.description}

onChange={(e)=>

setForm({

...form,

description:e.target.value

})

}

/>


<select

value={form.priority}

onChange={(e)=>

setForm({

...form,

priority:e.target.value

})

}

>

<option>Low</option>

<option>Medium</option>

<option>High</option>

</select>


<input

type="date"

value={form.deadline}

onChange={(e)=>

setForm({

...form,

deadline:e.target.value

})

}

/>


<button>

Add Task

</button>

</form>


<div className="grid">

{

tasks.map(task=>(

<div
className="card"
key={task.id}
>

<h3>

{task.title}

</h3>

<p>

{task.description}

</p>

<p>

{task.priority}

</p>

<p>

{task.deadline}

</p>

<p>

{

task.completed

?

"Completed"

:

"Pending"

}

</p>

{

!task.completed &&

<button

onClick={()=>

completeTask(task.id)

}

>

Complete

</button>

}

</div>

))

}

</div>

</div>

</>

)

}

export default Tasks