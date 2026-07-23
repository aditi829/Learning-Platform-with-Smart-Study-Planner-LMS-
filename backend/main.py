from fastapi import FastAPI,Depends,HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import date


from database import engine,get_db,Base
import models
from models import User,Course,Task,StudyPlanner
from schemas import *
from auth import *
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app=FastAPI()




app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
############ REGISTER ###########

@app.post("/register")
def register(
    data:RegisterSchema,
    db:Session=Depends(get_db)
):

    print("DATA RECEIVED:", data)

    existing=db.query(User).filter(
        User.email==data.email
    ).first()

    print("EXISTING:", existing)

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user=User(

        name=data.name,

        email=data.email,

        password=hash_password(
            data.password
        )

    )

    db.add(user)

    db.commit()

    return {"message":"Registered Successfully"}



############ LOGIN ###########


@app.post("/login")

def login(
    data:LoginSchema,
    db:Session=Depends(get_db)
):

    user=db.query(User).filter(
        User.email==data.email
    ).first()

    if not user:

        raise HTTPException(
            401,
            "Invalid Credentials"
        )

    if not verify_password(
        data.password,
        user.password
    ):

        raise HTTPException(
            401,
            "Invalid Credentials"
        )

    token=create_token(
        {"id":user.id}
    )

    return {
        "access_token":token
    }



############ DASHBOARD ###########

@app.get("/dashboard")

def dashboard(

current=Depends(
get_current_user
),

db:Session=Depends(
get_db
)

):

    total_courses=db.query(
        Course
    ).filter(
        Course.user_id==current.id
    ).count()

    total_tasks=db.query(
        Task
    ).filter(
        Task.user_id==current.id
    ).count()

    completed=db.query(
        Task
    ).filter(
        Task.user_id==current.id,
        Task.status=="Completed"
    ).count()

    pending=total_tasks-completed

    return {

        "total_courses":total_courses,

        "total_tasks":total_tasks,

        "completed_tasks":completed,

        "pending_tasks":pending

    }


########### COURSES ##########

@app.get("/courses")

def get_courses(

current=Depends(
get_current_user
),

db:Session=Depends(
get_db
)

):

    return db.query(
        Course
    ).filter(
        Course.user_id==current.id
    ).all()



@app.post("/courses")

def create_course(

data:CourseSchema,

current=Depends(
get_current_user
),

db:Session=Depends(
get_db
)

):

    course=Course(

        user_id=current.id,

        **data.dict()

    )

    db.add(course)

    db.commit()

    return {"message":"Course Added"}



@app.delete("/courses/{course_id}")
def delete_course(
    course_id: int,
    current=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    course = db.query(Course).filter(
        Course.id == course_id,
        Course.user_id == current.id
    ).first()

    if not course:
        raise HTTPException(404, "Course not found")

    db.delete(course)
    db.commit()

    return {"message": "Course deleted successfully"}
######## TASKS #########


@app.get("/tasks")

def tasks(

current=Depends(
get_current_user
),

db:Session=Depends(
get_db
)

):

    return db.query(
        Task
    ).filter(
        Task.user_id==current.id
    ).all()



@app.post("/tasks")

def create_task(

data:TaskSchema,

current=Depends(
get_current_user
),

db:Session=Depends(
get_db
)

):

    task=Task(

        user_id=current.id,

        **data.dict()

    )

    db.add(task)

    db.commit()

    return {"message":"Task Added"}



@app.put("/tasks/{task_id}/complete")

def complete(

task_id:int,

current=Depends(
get_current_user
),

db:Session=Depends(
get_db
)

):

    task=db.query(
        Task
    ).filter(
        Task.id==task_id,
        Task.user_id==current.id
    ).first()

    if not task:

        raise HTTPException(
            404,
            "Task not found"
        )

    task.status="Completed"

    db.commit()

    return {"message":"Completed"}



######## PLANNER ###########


@app.post("/planner")

def planner(

data:PlannerSchema,

current=Depends(
get_current_user
),

db:Session=Depends(
get_db
)

):

    p=StudyPlanner(

        user_id=current.id,

        **data.dict()

    )

    db.add(p)

    db.commit()

    return {"message":"Planner Added"}


@app.get("/planner/today")

def planner_today(

current=Depends(get_current_user),

db:Session=Depends(get_db)

):

    data=db.query(

        StudyPlanner,

        Task.title,

        Task.priority

    ).join(

        Task,

        StudyPlanner.task_id==Task.id

    ).filter(

        StudyPlanner.user_id==current.id,

        StudyPlanner.study_date==date.today()

    ).all()

    result=[]

    for planner, title, priority in data:

        result.append({

            "task_id":planner.task_id,

            "study_date":planner.study_date,

            "time_slot":planner.time_slot,

            "title":title,

            "priority":priority

        })

    return result