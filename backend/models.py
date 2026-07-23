from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    # relations
    courses = relationship("Course", cascade="all, delete", backref="user")
    tasks = relationship("Task", cascade="all, delete", backref="user")
    planners = relationship("StudyPlanner", cascade="all, delete", backref="user")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    course_name = Column(String(255))
    description = Column(String(500))
    start_date = Column(Date)
    end_date = Column(Date)

    created_at = Column(DateTime, default=datetime.utcnow)

    # IMPORTANT
    tasks = relationship("Task", cascade="all, delete", backref="course")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))

    title = Column(String(255))
    description = Column(String(500))
    priority = Column(String(50))
    deadline = Column(Date)
    status = Column(String(50), default="Pending")

    created_at = Column(DateTime, default=datetime.utcnow)

    # IMPORTANT
    planners = relationship("StudyPlanner", cascade="all, delete", backref="task")


class StudyPlanner(Base):
    __tablename__ = "study_planner"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))

    study_date = Column(Date)
    time_slot = Column(String(100))

    created_at = Column(DateTime, default=datetime.utcnow)