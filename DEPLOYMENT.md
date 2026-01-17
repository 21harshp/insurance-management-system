# 🚀 Deployment Guide: GitHub & Vercel

Complete step-by-step guide to deploy the Insurance Management System.

---

## 📋 Prerequisites

- [ ] GitHub account ([Sign up](https://github.com/signup))
- [ ] Vercel account ([Sign up](https://vercel.com/signup))
- [ ] MongoDB Atlas account (already configured)
- [ ] Git installed on your machine

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

Open a terminal in your project directory:

```bash
cd "/Users/harshpatel/Documents/rohit/Insurance Management system"
git init
```

### Step 2: Stage All Files

```bash
git add .
```

**What this does:** Adds all files to Git (`.env` is excluded by `.gitignore`)

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Insurance Management System"
```

### Step 4: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `insurance-management-system` (or your choice)
3. Description: "Full-stack Insurance Management System with Health & Motor policies"
4. **Keep it Private** (recommended) or Public
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

### Step 5: Connect and Push

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Replace** `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

✅ **Verify:** Refresh GitHub page - you should see all your code!

---

## Part 2: Deploy Backend to Vercel

### Step 1: Import Project

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `insurance-management-system` repository
4. Click **"Import"**

### Step 2: Configure Backend

1. **Root Directory:** Click "Edit" and select `backend`
2. **Framework Preset:** Leave as "Other"
3. **Build Command:** Leave empty
4. **Output Directory:** Leave empty

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://harshrpatel305_db_user:Harsh%402142@cluster0.kx5hweh.mongodb.net/insurance_management?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `your_secure_jwt_secret_change_in_production_123456` |
| `ADMIN_ID` | `ADMIN` |
| `ADMIN_PASSWORD` | `admin123` (or your secure password) |
| `FRONTEND_URL` | `*` (temporary - will update after frontend deployment) |

### Step 4: Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

✅ **Test:** Visit `https://your-backend.vercel.app/api/health` - should show `{"status":"OK"}`

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Import Project Again

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `insurance-management-system` repository again
4. Click **"Import"**

### Step 2: Configure Frontend

1. **Root Directory:** Click "Edit" and select `frontend`
2. **Framework Preset:** Should auto-detect "Vite"
3. **Build Command:** `npm run build` (should be auto-filled)
4. **Output Directory:** `dist` (should be auto-filled)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app/api` |

**Replace** `your-backend.vercel.app` with your actual backend URL from Part 2.

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. **Copy your frontend URL** (e.g., `https://your-frontend.vercel.app`)

---

## Part 4: Update Backend CORS

### Step 1: Update Backend Environment Variable

1. Go to your backend project in Vercel dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Find `FRONTEND_URL` and click **"Edit"**
4. Change value from `*` to your frontend URL: `https://your-frontend.vercel.app`
5. Click **"Save"**

### Step 2: Redeploy Backend

1. Go to **"Deployments"** tab
2. Click the three dots on the latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment to complete

---

## Part 5: Test Your Deployment 🎉

### Step 1: Open Your App

Visit your frontend URL: `https://your-frontend.vercel.app`

### Step 2: Login as Admin

- **User ID:** `ADMIN`
- **Password:** `admin123` (or your configured password)

### Step 3: Test Functionality

1. ✅ Create a Sales Manager
2. ✅ Logout
3. ✅ Login as Sales Manager
4. ✅ Create a Health Insurance policy
5. ✅ Create a Motor Insurance policy
6. ✅ Search and filter policies

---

## 📝 Important URLs to Save

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://your-frontend.vercel.app` | Main application |
| **Backend** | `https://your-backend.vercel.app` | API server |
| **GitHub** | `https://github.com/YOUR_USERNAME/YOUR_REPO` | Source code |
| **MongoDB** | MongoDB Atlas Dashboard | Database |

---

## 🔒 Security Recommendations

1. **Change Admin Password:** Update `ADMIN_PASSWORD` in Vercel backend settings
2. **Secure JWT Secret:** Use a strong random string for `JWT_SECRET`
3. **MongoDB Security:** Ensure MongoDB Atlas has IP whitelist configured
4. **Environment Variables:** Never commit `.env` files to Git (already in `.gitignore`)

---

## 🔄 Making Updates

When you make code changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will **automatically redeploy** both frontend and backend! 🚀

---

## ❓ Troubleshooting

### Issue: "CORS Error" in browser console
**Solution:** Verify `FRONTEND_URL` in backend matches your frontend Vercel URL exactly

### Issue: "Network Error" when logging in
**Solution:** Check `VITE_API_URL` in frontend environment variables includes `/api` at the end

### Issue: Backend deployment fails
**Solution:** Ensure `vercel.json` exists in backend folder

### Issue: Frontend shows blank page
**Solution:** Check browser console for errors. Verify API URL is correct.

---

## 🎊 You're Done!

Your Insurance Management System is now live on the internet! Share your frontend URL with users.
