import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: string | number | undefined;
}

export interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface TableState {
  rows: TableRow[];
  columns: Column[];
  searchQuery: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
  editingRows: string[];
}

const defaultColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'age', label: 'Age', visible: true },
  { id: 'role', label: 'Role', visible: true },
];

const initialState: TableState = {
  rows: [
    { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', age: 29, role: 'Developer' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', age: 35, role: 'Analyst' },
    { id: '6', name: 'David Miller', email: 'david@example.com', age: 31, role: 'Developer' },
    { id: '7', name: 'Emma Davis', email: 'emma@example.com', age: 27, role: 'Designer' },
    { id: '8', name: 'Frank White', email: 'frank@example.com', age: 39, role: 'Manager' },
    { id: '9', name: 'Grace Lee', email: 'grace@example.com', age: 26, role: 'Developer' },
    { id: '10', name: 'Henry Taylor', email: 'henry@example.com', age: 33, role: 'Analyst' },
    { id: '11', name: 'Ivy Chen', email: 'ivy@example.com', age: 30, role: 'Developer' },
    { id: '12', name: 'Jack Wilson', email: 'jack@example.com', age: 41, role: 'Manager' },
    { id: '13', name: 'Kate Brown', email: 'kate@example.com', age: 28, role: 'Designer' },
    { id: '14', name: 'Leo Martinez', email: 'leo@example.com', age: 34, role: 'Developer' },
    { id: '15', name: 'Mia Anderson', email: 'mia@example.com', age: 29, role: 'Analyst' },
    { id: '16', name: 'Noah Garcia', email: 'noah@example.com', age: 36, role: 'Developer' },
    { id: '17', name: 'Olivia Moore', email: 'olivia@example.com', age: 32, role: 'Designer' },
    { id: '18', name: 'Paul Jackson', email: 'paul@example.com', age: 44, role: 'Manager' },
    { id: '19', name: 'Quinn Harris', email: 'quinn@example.com', age: 27, role: 'Developer' },
    { id: '20', name: 'Rachel Clark', email: 'rachel@example.com', age: 31, role: 'Analyst' },
    { id: '21', name: 'Sam Lewis', email: 'sam@example.com', age: 35, role: 'Developer' },
    { id: '22', name: 'Tina Walker', email: 'tina@example.com', age: 29, role: 'Designer' },
    { id: '23', name: 'Uma Hall', email: 'uma@example.com', age: 38, role: 'Manager' },
    { id: '24', name: 'Victor Young', email: 'victor@example.com', age: 33, role: 'Developer' },
    { id: '25', name: 'Wendy King', email: 'wendy@example.com', age: 30, role: 'Analyst' },
    { id: '26', name: 'Xavier Thompson', email: 'xavier@example.com', age: 34, role: 'Developer' },
  ],
  columns: defaultColumns,
  searchQuery: '',
  sortColumn: null,
  sortDirection: 'asc',
  page: 0,
  rowsPerPage: 10,
  editingRows: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<TableRow[]>) => {
      state.rows = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.rows.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<TableRow>) => {
      const index = state.rows.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter(row => row.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 0;
    },
    setSortColumn: (state, action: PayloadAction<string>) => {
      if (state.sortColumn === action.payload) {
        // Cycle through: asc -> desc -> null (default)
        if (state.sortDirection === 'asc') {
          state.sortDirection = 'desc';
        } else if (state.sortDirection === 'desc') {
          state.sortColumn = null;
          state.sortDirection = 'asc';
        }
      } else {
        state.sortColumn = action.payload;
        state.sortDirection = 'asc';
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(col => col.id !== action.payload);
      // Remove the column data from all rows
      state.rows = state.rows.map(row => {
        const { [action.payload]: _, ...rest } = row;
        return rest as TableRow;
      });
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    reorderColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    startEditing: (state, action: PayloadAction<string>) => {
      if (!state.editingRows.includes(action.payload)) {
        state.editingRows.push(action.payload);
      }
    },
    stopEditing: (state, action: PayloadAction<string>) => {
      state.editingRows = state.editingRows.filter(id => id !== action.payload);
    },
    stopAllEditing: (state) => {
      state.editingRows = [];
    },
  },
});

export const {
  setRows,
  addRow,
  updateRow,
  deleteRow,
  setSearchQuery,
  setSortColumn,
  setPage,
  addColumn,
  deleteColumn,
  toggleColumnVisibility,
  reorderColumns,
  startEditing,
  stopEditing,
  stopAllEditing,
} = tableSlice.actions;

export default tableSlice.reducer;
