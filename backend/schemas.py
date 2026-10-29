from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class HabitBase(BaseModel):
    name: str

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    is_completed: bool
    date: datetime

    class Config:
        from_attributes = True

class ScheduleBase(BaseModel):
    time: str
    task: str

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True
