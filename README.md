# Dynamic Data Table Manager

A powerful data table manager built with Next.js 14, Redux Toolkit, and Material UI for managing and manipulating tabular data with advanced features.

## 🚀 Live Demo

Visit the project folder `data-table-manager` and run:

```bash
cd data-table-manager
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## ✨ Features

### Core Features ✅
- **Interactive Data Table** - Sortable columns with 3-state sorting (ASC → DESC → Default), global search, and pagination (10 rows per page)
- **Add New Rows** - Dynamic form to add new rows with validation
- **Dynamic Column Management** - Add custom columns, show/hide columns with persistence
- **CSV Import/Export** - Import data from CSV files and export visible columns only
- **Persistent State** - Column preferences saved using Redux Persist

### Bonus Features 🎁
- **Inline Editing** - Double-click rows to edit inline with real-time validation
- **Save All / Cancel All** - Bulk edit multiple rows with save/cancel all buttons
- **Input Validation** - Age must be a number (0-150), email format validation, required fields
- **Drag & Drop Column Reordering** - Reorder columns by dragging in Manage Columns dialog
- **Row Actions** - Edit and delete rows with confirmation dialogs
- **Theme Toggle** - Switch between light and dark modes
- **Responsive Design** - Works seamlessly on all screen sizes
- **Full TypeScript** - Complete type safety

## 🛠️ Tech Stack

- **Next.js 14.2.3** (App Router)
- **React 18.3.1**
- **TypeScript 5.4.5**
- **Redux Toolkit 2.2.3** + Redux Persist 6.0.0
- **Material UI v5.15.15**
- **React Hook Form 7.51.3** (Form handling)
- **@dnd-kit** (Drag and Drop column reordering)
- **PapaParse 5.4.1** (CSV parsing)
- **FileSaver.js 2.0.5** (CSV export)
- **Zod 3.23.6** (Schema validation)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18.20.0 or higher
- npm or yarn package manager

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Sarwan-Projects/Dynamic-Data-Table-Manager.git
cd Dynamic-Data-Table-Manager/data-table-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Quick Testing Guide

1. **3-State Sorting** - Click column header once (ASC), twice (DESC), three times (Default/No Sort)
2. **Add New Row** - Click "Add Row" button, fill the form with validation, submit
3. **Inline Editing** - Double-click any row to edit inline, fields validate in real-time
4. **Bulk Editing** - Edit multiple rows, then use "Save All" or "Cancel All" buttons
5. **Validation** - Try entering invalid age (letters or >150) or invalid email format
6. **Manage Columns** - Click "Manage Columns" to:
   - Add new fields (Department, Location)
   - Drag columns to reorder them
   - Toggle visibility with checkboxes
   - Delete custom columns
7. **Import CSV** - Click "Import CSV" and select `sample-data.csv` included in the project
8. **Export CSV** - Click "Export CSV" to download current table data (visible columns only)
9. **Delete Row** - Click delete icon and confirm
10. **Theme Toggle** - Click sun/moon icon to switch between light/dark mode
11. **Persistence** - Refresh page to verify column preferences and order are saved

## 📁 Project Structure

```
data-table-manager/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── DataTable.tsx       # Main table component with inline editing
│   ├── SearchBar.tsx       # Search functionality
│   ├── ImportExportButtons.tsx  # CSV import/export
│   ├── ManageColumnsDialog.tsx  # Column management with drag & drop
│   ├── DeleteConfirmDialog.tsx  # Delete confirmation
│   ├── ThemeToggle.tsx     # Theme switcher
│   └── Providers.tsx       # Redux & MUI providers
├── lib/redux/
│   ├── store.ts            # Redux store configuration
│   ├── hooks.ts            # Typed Redux hooks
│   └── slices/
│       └── tableSlice.ts   # Table state management
└── sample-data.csv         # Sample CSV for testing
```

## 🎯 Key Implementation Details

- **State Management**: Redux Toolkit with Redux Persist for localStorage
- **CSV Handling**: PapaParse for parsing, FileSaver.js for downloads
- **Drag & Drop**: @dnd-kit for column reordering
- **Theme System**: Material UI theming with React Context for toggle
- **Validation**: Real-time input validation with error messages
- **Type Safety**: Full TypeScript coverage with strict type checking

## 📝 Features Checklist

### Core Requirements ✅
- [x] Table View with 3-state sorting (ASC → DESC → Default)
- [x] Global search across all fields
- [x] Client-side pagination (10 rows per page)
- [x] Add new rows dynamically with validation
- [x] Dynamic column management (add, show/hide)
- [x] CSV Import with error handling (PapaParse)
- [x] CSV Export (visible columns only, FileSaver.js)
- [x] Persistent column preferences (Redux Persist + localStorage)

### Bonus Requirements ✅
- [x] Inline row editing (double-click to edit)
- [x] Input validation (age: 0-150, email format, required fields)
- [x] Save All / Cancel All buttons for bulk editing
- [x] Row actions (Edit, Delete with confirmation dialog)
- [x] Theme toggle (Light/Dark mode with MUI theming)
- [x] Column reordering via drag-and-drop (@dnd-kit)
- [x] Fully responsive design (mobile, tablet, desktop)
- [x] TypeScript with strict type checking
- [x] React Hook Form integration

## 🌐 Deployment

### Deploy to Render

1. Fork or clone this repository
2. Sign up at [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `data-table-manager`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variable**: `NODE_VERSION=18.20.0`
6. Deploy!

### Deploy to Vercel

```bash
cd data-table-manager
vercel
```

### Deploy to Netlify

```bash
cd data-table-manager
npm run build
# Deploy the .next folder
```

## 📄 License

MIT

## 👨‍💻 Author

Created as part of a frontend interview assignment demonstrating:
- Advanced React 18 patterns and hooks
- Redux Toolkit state management
- Material UI component library
- TypeScript best practices
- CSV data handling
- Drag & drop functionality
- Form validation
- Responsive design
- Modern Next.js 14 App Router
