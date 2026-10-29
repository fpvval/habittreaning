from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import database as db
import schemas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Разрешаем фронтенду обращаться к бэкенду (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Функция для получения сессии базы данных
def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

@app.get("/")
def read_root():
    return {"message": "Habit Tracker API is running!"}

# --- Привычки ---
@app.get("/habits", response_model=list[schemas.Habit])
def get_habits(database: Session = Depends(get_db)):
    return database.query(db.Habit).all()

@app.post("/habits", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, database: Session = Depends(get_db)):
    db_habit = db.Habit(name=habit.name)
    database.add(db_habit)
    database.commit()
    database.refresh(db_habit)
    return db_habit

@app.put("/habits/{habit_id}", response_model=schemas.Habit)
def toggle_habit(habit_id: int, database: Session = Depends(get_db)):
    habit = database.query(db.Habit).filter(db.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    habit.is_completed = not habit.is_completed
    database.commit()
    database.refresh(habit)
    return habit

# --- Расписание ---
@app.get("/schedule", response_model=list[schemas.Schedule])
def get_schedule(database: Session = Depends(get_db)):
    return database.query(db.ScheduleItem).all()

@app.post("/schedule", response_model=schemas.Schedule)
def create_schedule_item(item: schemas.ScheduleCreate, database: Session = Depends(get_db)):
    db_item = db.ScheduleItem(time=item.time, task=item.task)
    database.add(db_item)
    database.commit()
    database.refresh(db_item)
    return db_item
