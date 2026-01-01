# 🚀 Quick Start Guide

Get the SKU Management System up and running in 5 minutes!

## Prerequisites Check

Verify you have the required software:

```bash
# Check Java version (need 17+)
java -version

# Check Maven version
mvn -version

# Check Node.js version (need 16+)
node -version

# Check npm version
npm -version
```

## Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ **Backend ready** when you see: "Started SkuManagementApplication"

Test it: Open http://localhost:8080/api/skus in your browser

## Step 2: Start the Frontend

Open a **NEW** terminal and run:

```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend ready** when you see: "Local: http://localhost:3000"

## Step 3: Access the Application

Open your browser and go to: **http://localhost:3000**

You should see the SKU Management dashboard with sample data!

## What You Can Do Now

1. **Browse SKUs**: See 8 pre-loaded sample products
2. **Add New SKU**: Click the "+ Add SKU" button
3. **Search**: Type in the search box to filter SKUs
4. **Filter by Category**: Use the category dropdown
5. **Edit SKU**: Click "Edit" on any row
6. **Delete SKU**: Click "Delete" on any row (with confirmation)

## Sample Data Included

The system comes with 8 sample SKUs:
- Wireless Mouse (Electronics)
- USB-C Cable (Electronics)
- Office Chair (Furniture)
- Standing Desk (Furniture)
- Notebook Set (Stationery)
- Pen Set (Stationery)
- Laptop Stand (Electronics)
- Mechanical Keyboard (Electronics)

## Common Commands

### Backend
```bash
# Start backend
mvn spring-boot:run

# Run tests
mvn test

# Create JAR
mvn clean package
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Port Already in Use

**Backend (8080)**:
```bash
# Find and kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

**Frontend (3000)**:
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Backend Not Starting

1. Make sure you have Java 17 or higher
2. Try `mvn clean install` first
3. Check if port 8080 is available

### Frontend Can't Connect to Backend

1. Verify backend is running: `curl http://localhost:8080/api/skus`
2. Check browser console for errors
3. Make sure both servers are running

## Next Steps

1. **Explore the API**: Check the README.md for all API endpoints
2. **Customize**: Modify colors, add fields, or extend functionality
3. **Deploy**: Follow production deployment guidelines in README.md
4. **Add Features**: Authentication, more fields, export to CSV, etc.

## Need Help?

- Check the full **README.md** for detailed documentation
- Review the API endpoints section
- Check H2 database console: http://localhost:8080/h2-console

---

**Enjoy managing your SKUs! 📦**
