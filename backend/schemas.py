from pydantic import BaseModel,EmailStr
from datetime import date


class RegisterSchema(BaseModel):

    name:str
    email:EmailStr
    password:str


class LoginSchema(BaseModel):

    email:EmailStr
    password:str


class CourseSchema(BaseModel):

    course_name:str
    description:str
    start_date:date
    end_date:date


class TaskSchema(BaseModel):

    course_id:int
    title:str
    description:str
    priority:str
    deadline:date


class PlannerSchema(BaseModel):

    task_id:int
    study_date:date
    time_slot:str