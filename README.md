# Smart-Expense-Tracker
Full-featured expense tracking web application with login/signup, expense entry, category summaries, charts, and cloud deployment

# Smart Expense Tracker

A full-stack expense tracking application using Java Spring Boot (backend), React.js (frontend), MySQL (database), and AWS EC2 + GitHub Actions for deployment.

---

## 📁 Folder Structure

```
smart-expense-tracker/
├── backend/                    # Spring Boot app (Java)
├── frontend/                   # React app
├── .github/workflows/         # GitHub Actions CI/CD
├── docker-compose.yml         # Docker services setup
└── README.md
```

---

## 🚀 Features
- JWT Authentication (Register/Login)
- Add, edit, delete, and view expenses
- Dashboard with visual charts
- Persistent storage with MySQL
- Containerized with Docker
- CI/CD pipeline with GitHub Actions
- Deployment to AWS EC2

---

## 🔨 Technologies Used

### Backend:
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA (Hibernate)
- MySQL
- JWT (JSON Web Token)

### Frontend:
- React.js
- Axios
- Chart.js
- React Router

### DevOps / Deployment:
- Docker & Docker Compose
- GitHub Actions
- AWS EC2 (Ubuntu)

---

## 📦 How to Run Locally (Dev)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/smart-expense-tracker.git
cd smart-expense-tracker
```

### 2. Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm start
```

### 4. Docker Compose (Alternative)
```bash
docker-compose up --build
```

---

## 🌐 Deployment Steps (AWS EC2)
1. Create an EC2 instance (Ubuntu) and install Docker & Docker Compose.
2. Set up GitHub Secrets: `EC2_HOST`, `EC2_SSH_KEY`
3. GitHub Actions will build and SSH deploy on `git push`.

---

## 📄 TODO
- [ ] Implement JWT-based auth in backend
- [ ] Build frontend dashboard layout
- [ ] Connect frontend to backend API
- [ ] Add GitHub Actions CI/CD workflow
- [ ] Document API routes

---

## 📎 Resources
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://reactjs.org/docs/getting-started.html)
- [Docker Docs](https://docs.docker.com/get-started/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [AWS EC2 Setup](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html)

---

## 📜 License
MIT
