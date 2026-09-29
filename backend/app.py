from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "campus_event_hub"
}

def get_db():
    return mysql.connector.connect(**DB_CONFIG)

def query(sql, params=(), fetch=False):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(sql, params)
    result = cursor.fetchall() if fetch else cursor.lastrowid
    db.commit()
    cursor.close()
    db.close()
    return result

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "message": "Campus Event Hub API is running"})

@app.post("/api/register")
def register():
    data = request.json
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "All fields are required"}), 400
    try:
        user_id = query("INSERT INTO users (name,email,password) VALUES (%s,%s,%s)",
                         (data["name"], data["email"], data["password"]))
        return jsonify({"message": "Registration successful", "user_id": user_id}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"message": "Email already registered"}), 409

@app.post("/api/login")
def login():
    data = request.json
    users = query("SELECT id,name,email,role FROM users WHERE email=%s AND password=%s",
                  (data.get("email"), data.get("password")), True)
    if not users:
        return jsonify({"message": "Invalid email or password"}), 401
    return jsonify(users[0])

@app.get("/api/events")
def events():
    rows = query("""SELECT e.id,e.title,e.description,e.category,e.event_date,e.venue,
                    e.capacity,COUNT(r.id) AS registered
                    FROM events e LEFT JOIN registrations r ON e.id=r.event_id
                    GROUP BY e.id ORDER BY e.event_date""", fetch=True)
    return jsonify(rows)

@app.post("/api/events")
def add_event():
    data = request.json
    event_id = query("""INSERT INTO events
        (title,description,category,event_date,venue,capacity)
        VALUES (%s,%s,%s,%s,%s,%s)""",
        (data["title"],data["description"],data["category"],data["event_date"],
         data["venue"],data["capacity"]))
    return jsonify({"message": "Event created", "id": event_id}), 201

@app.delete("/api/events/<int:event_id>")
def delete_event(event_id):
    query("DELETE FROM events WHERE id=%s", (event_id,))
    return jsonify({"message": "Event deleted"})

@app.post("/api/events/<int:event_id>/register")
def register_event(event_id):
    data = request.json
    event = query("""SELECT e.capacity,COUNT(r.id) AS registered
                     FROM events e LEFT JOIN registrations r ON e.id=r.event_id
                     WHERE e.id=%s GROUP BY e.id""", (event_id,), True)
    if not event:
        return jsonify({"message": "Event not found"}), 404
    if event[0]["registered"] >= event[0]["capacity"]:
        return jsonify({"message": "Event is full"}), 409
    try:
        query("INSERT INTO registrations (user_id,event_id) VALUES (%s,%s)",
              (data.get("user_id"), event_id))
        return jsonify({"message": "Event registration successful"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"message": "Already registered for this event"}), 409

@app.get("/api/users/<int:user_id>/registrations")
def my_registrations(user_id):
    rows = query("""SELECT e.id,e.title,e.category,e.event_date,e.venue
                    FROM registrations r JOIN events e ON r.event_id=e.id
                    WHERE r.user_id=%s ORDER BY e.event_date""", (user_id,), True)
    return jsonify(rows)

@app.get("/api/stats")
def stats():
    return jsonify(query("""SELECT
        (SELECT COUNT(*) FROM users WHERE role='student') AS students,
        (SELECT COUNT(*) FROM events) AS events,
        (SELECT COUNT(*) FROM registrations) AS registrations""", fetch=True)[0])

if __name__ == "__main__":
    app.run(debug=True, port=5000)
