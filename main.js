let addTask = document.querySelector("#addTask")
let addModal = $("#addModal")
let addModalForm = document.querySelector("#addModalForm")
let assignModal = $("#assignModal")
let assignModalForm = document.querySelector("#assignModalForm")
let pk = 0
let editModal = $("#editModal")


// local task storage
let unassignedTasks = []
let inProgressTasks = []
let finishedTasks = []


// Create task
addTask.addEventListener('click', ()=>{
    addModal.modal("show")
})
addModalForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    let taskDescription = document.querySelector("#taskDescription")
    let priorityCheck = document.querySelector("#priorityCheck")
    unassignedTasks.push({'pk': pk, 'description': taskDescription.value, 'priority': priorityCheck.checked})
    pk += 1
    taskDescription.value = ""
    priorityCheck.checked = false
    addModal.modal("hide")
    renderUnassigned()
})


// Display tasks
let renderUnassigned = ()=>{
    let taskDiv = document.querySelector("#unassignedTasks")
    taskDiv.innerHTML = ""
    for(task of unassignedTasks){
        taskDiv.appendChild(cardBuilder(task.description, task.priority, "Assign", task.pk))
    }
    addClicksForAssign()
}
let renderInProgress = ()=>{
    let taskDiv = document.querySelector("#inProgressTasks")
    taskDiv.innerHTML = ""
    for(task of inProgressTasks){
        taskDiv.appendChild(cardBuilder(task.description, task.priority, "Finish", task.pk, task.assignedTo))
    }
    addClicksForComplete()
}
let renderFinished = ()=>{
    let taskDiv = document.querySelector("#finishedTasks")
    taskDiv.innerHTML = ""
    for(task of finishedTasks){
        taskDiv.appendChild(cardBuilder(task.description, task.priority, "Finish", task.pk, task.assignedTo, false))
    }
}


// Assign tasks
let addClicksForAssign = ()=>{
    let assignBtns = document.querySelectorAll(".assign")
    assignBtns.forEach((ele)=>{
        ele.addEventListener('click', ()=>{
            assignModal.modal("show")
            document.querySelector("#pk").value = ele.id
        })
    })
}
assignModalForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    let person = document.querySelector("#taskPerson")
    let taskPK = document.querySelector("#pk")
    for(x in unassignedTasks){
        if(unassignedTasks[x].pk==taskPK.value){
            inProgressTasks.push({"pk": unassignedTasks[x].pk, 'description': unassignedTasks[x].description, 'priority': unassignedTasks[x].priority, 'assignedTo': person.value})
            unassignedTasks.splice(x, 1)
        }
    }
    person.value = ""
    taskPK.value = ""
    assignModal.modal("hide")
    renderUnassigned()
    renderInProgress()
})


// Edit tasks
let editTask = (pk, type)=>{
    let taskList = type === "assign" ? unassignedTasks : inProgressTasks
    console.log(taskList)
    let task
    for(x in taskList){
        if(taskList[x].pk == pk){
            task = taskList[x]
            taskList.splice(x, 1)
        }
    }
    type === "assign" ? unassignedTasks = taskList : inProgressTasks = taskList
    let editDesc = document.querySelector("#editTaskDescription")
    let editPriCheck = document.querySelector("#editPriorityCheck")
    let editPerson = document.querySelector("#editTaskPerson")
    editDesc.value = task.description
    editPriCheck.checked = task.priority
    editPerson.value = task.assignedTo ? task.assignedTo : ""
    editModal.modal("show")
    let editForm = document.querySelector("#editModalForm")
    editForm.addEventListener("submit", (e)=>{
        if(editDesc.value){
            console.log("in edit event")
            e.preventDefault()
            let editedTask = {"pk":pk, "description":editDesc.value, "priority":editPriCheck.checked, "assignedTo":editPerson.value}
            if(type === "assign"){
                if(editPerson.value){
                    inProgressTasks.push(editedTask)
                }else{
                    unassignedTasks.push(editedTask)
                }
            }else{
                inProgressTasks.push(editedTask)
            }
            editModal.modal("hide")
            editDesc.value = ""
            editPriCheck.checked = ""
            editPerson.value = ""
            renderUnassigned()
            renderInProgress()
        }
    })
}

// Delete tasks
let deleteTask = (pk, type)=>{
    let taskList = type === "assign" ? unassignedTasks : inProgressTasks
    for(x in taskList){
        if(taskList[x].pk == pk){
            taskList.splice(x, 1)
        }
    }
    type === "assign" ? unassignedTasks = taskList : inProgressTasks = taskList
    renderUnassigned()
    renderInProgress()
}


// complete tasks
let addClicksForComplete = ()=>{
    let finishBtns = document.querySelectorAll(".finish")
    finishBtns.forEach((ele)=>{
        ele.addEventListener('click', ()=>{
            let taskPk = ele.id
            for(x in inProgressTasks){
                if(inProgressTasks[x].pk==taskPk){
                    finishedTasks.push({"pk": inProgressTasks[x].pk, 'description': inProgressTasks[x].description, 'priority': inProgressTasks[x].priority, 'assignedTo': inProgressTasks[x].assignedTo})
                    inProgressTasks.splice(x, 1)
                }
            }
            renderInProgress()
            renderFinished()
        })
    })
}



// Helper functions
let cardBuilder = (description, priority, btnText, pk, assignedTo="Unassigned", notFinished=true)=>{
    let cardDiv = document.createElement('div')
    cardDiv.classList.add("card")
    if(notFinished){
        cardDiv.innerHTML = `<div class="card-header">
                ${assignedTo}
            </div>
            <div class="card-body">
                <p class="card-text">${description}</p>
                <a href="#" id="${pk}" class="btn btn-sm btn-primary py-0 ${btnText.toLowerCase()}">${btnText}</a>
                <a class="btn btn-sm btn-primary py-0" onclick="editTask(${pk}, '${btnText.toLowerCase()}')">Edit</a>
                <a class="btn btn-sm btn-primary py-0" onclick="deleteTask(${pk}, '${btnText.toLowerCase()}')">Delete</a>
            </div>`
    }else{
        cardDiv.innerHTML = `<div class="card-header">
                ${assignedTo}
            </div>
            <div class="card-body">
                <p class="card-text">${description}</p>
            </div>`
    }
    return cardDiv
}

$(".close").on("click", function(){
    $(this).closest($(".modal")).modal("hide")
})

