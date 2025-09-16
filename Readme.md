# 🚀 InjectionLab – Safe Hacking, Secure Learning

> An interactive SQL Injection Learning Platform that blends **theory with hands-on practice** in a **safe sandboxed environment**.

![SQL Injection Banner](https://img.shields.io/badge/Cybersecurity-Education-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge\&logo=mongodb)
![Status](https://img.shields.io/badge/Status-POC-orange?style=for-the-badge)

---

## 📖 Project Overview

SQL Injection remains one of the **most critical web vulnerabilities (OWASP Top 10)**. Traditional education often focuses on **theory only**, leaving learners unprepared for real-world threats.

**InjectionLab** solves this by offering:
✅ **Safe sandboxed practice** with isolated databases
✅ **Step-by-step progression** from beginner to advanced attacks
✅ **Real-time feedback & hints** on every query
✅ **Coverage of both attack & defense techniques**
✅ **Admin dashboards** for instructors

Built with the **MERN stack**, this platform bridges the gap between **classroom learning and real-world application**.

---

## 🎯 Objectives

* Teach SQL injection vulnerabilities **through practice**
* Provide **progressive difficulty levels** (5 stages)
* Ensure **security via sandboxed SQLite environments**
* Offer **educational content, hints, and prevention techniques**
* Enable **tracking of progress, achievements, and analytics**

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios, React Router
**Backend:** Node.js, Express.js, JWT, bcrypt, Helmet, CORS
**Databases:** MongoDB (users, progress, content) + SQLite (sandbox practice DBs)
**Dev Tools:** Git, Postman, Jest, Nodemon

---

## 🏗️ System Architecture

```
Frontend (React.js) 
   ↕
Backend (Express.js + Node.js) 
   ↕
MongoDB (users, progress, content) + SQLite (sandboxed practice DBs)
```

### Core Components

* **User Management** → Authentication, roles, JWT sessions
* **Learning System** → Challenges, content, achievements, tracking
* **SQL Injection Engine** → Safely executes queries in sandboxed DBs
* **Real-time Feedback** → Explains success/failure, hints, prevention tips
* **Admin Dashboard** → User stats, progress monitoring, system health

---

## 🧩 Learning Progression

| Level | Focus Area                  | Skills Learned                       |
| ----- | --------------------------- | ------------------------------------ |
| 1     | Basic Authentication Bypass | OR conditions, comments              |
| 2     | Information Disclosure      | Data enumeration, error exploitation |
| 3     | UNION-based Injection       | Combining tables & advanced queries  |
| 4     | Boolean-based Blind         | Inference without direct results     |
| 5     | Time-based Blind            | Timing-based extraction techniques   |

---

## ⚡ Getting Started

### 1. Clone Repo

```bash
git clone https://github.com/your-repo/injectionlab.git
```

### 2. Setup Backend and install deps

```bash
cd backend
npm install
npm start
```

### 3. Setup backend
```bash
cd frontend
npm run dev
```

### Add required environment configurations for frontend and backend
---

## 🎮 Demo Flow

1. Register / Login as student
2. Pick a challenge (Level 1 → Level 5)
3. Enter SQL queries → get instant feedback
4. Earn points, badges & see progress
5. Instructors track via **Admin Dashboard**

---

## 🛡️ Security Features

* **Sandboxed SQLite DBs** → one per user/session
* **Rate limiting & query length restrictions**
* **Blocked destructive commands (DROP, DELETE, etc.)**
* **Auto cleanup of expired sessions**
* **Secure password hashing (bcrypt)**

---

## 📊 Future Scope

* Add **other OWASP Top 10 vulnerabilities**
* Multi-language support
* Cloud deployment & scaling
* Gamification features

---

## 🤝 Contributors

* Aditya Gangwar @Adityagangwar2674
* Noman Mirza @Nomanbaig7342
* Parth Abhang @Parth0124
* Arya Sali @Arya2422