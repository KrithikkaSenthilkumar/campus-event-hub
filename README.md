# Campus Event Hub

A full-stack campus event management application built with React, Flask REST API, and MySQL.

## Features
- Student registration and login
- Browse and search-ready event listing
- Event registration with capacity validation
- My registered events
- Admin event creation and deletion
- REST API backend
- MySQL relational database

## Tech Stack
React + Vite | Python Flask | MySQL | REST API | CSS

## Run

### Database
Run `backend/database.sql` in MySQL. If your MySQL root account has a password, update `DB_CONFIG` in `backend/app.py`.

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Backend: `http://127.0.0.1:5000`

## Demo accounts
Admin: `admin@campus.com` / `admin123`  
Student: `student@campus.com` / `student123`

## Resume
**Campus Event Hub — Full Stack Web Application**  
Built a full-stack campus event management platform using React, Flask REST APIs and MySQL, implementing authentication, event registration, capacity validation, CRUD operations and dashboard-based event management.
