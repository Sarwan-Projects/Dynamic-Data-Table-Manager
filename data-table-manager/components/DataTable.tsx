'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  TextField,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { Edit, Delete, Save, Cancel, SaveAlt, CancelOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setSortColumn,
  setPage,
  deleteRow,
  updateRow,
} from '@/lib/redux/slices/tableSlice';
import { useState } from 'react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function DataTable() {
  const dispatch = useAppDispatch();
  const { rows, columns, searchQuery, sortColumn, sortDirection, page, rowsPerPage } =
    useAppSelector((state) => state.table);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const visibleColumns = columns.filter((col) => col.visible);

  // Filter rows based on search
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal === undefined || bVal === undefined) return 0;
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (columnId: string) => {
    dispatch(setSortColumn(columnId));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleDeleteClick = (id: string) => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
    }
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleDoubleClick = (row: any) => {
    const newEditingRows = new Set(editingRows);
    newEditingRows.add(row.id);
    setEditingRows(newEditingRows);
    setEditedData({
      ...editedData,
      [row.id]: { ...row },
    });
  };

  const validateField = (field: string, value: any): string | null => {
    if (field === 'age') {
      const age = Number(value);
      if (isNaN(age) || age < 0 || age > 150) {
        return 'Age must be a valid number between 0 and 150';
      }
    }
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email format';
      }
    }
    if (!value || String(value).trim() === '') {
      return 'This field is required';
    }
    return null;
  };

  const handleSaveClick = (rowId: string) => {
    const rowData = editedData[rowId];
    const errors: Record<string, string> = {};
    
    // Validate all fields
    visibleColumns.forEach((col) => {
      const error = validateField(col.id, rowData[col.id]);
      if (error) {
        errors[`${rowId}-${col.id}`] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    dispatch(updateRow(rowData));
    const newEditingRows = new Set(editingRows);
    newEditingRows.delete(rowId);
    setEditingRows(newEditingRows);
    
    const newEditedData = { ...editedData };
    delete newEditedData[rowId];
    setEditedData(newEditedData);
    setValidationErrors({});
  };

  const handleCancelClick = (rowId: string) => {
    const newEditingRows = new Set(editingRows);
    newEditingRows.delete(rowId);
    setEditingRows(newEditingRows);
    
    const newEditedData = { ...editedData };
    delete newEditedData[rowId];
    setEditedData(newEditedData);
    
    // Clear validation errors for this row
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${rowId}-`)) {
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  const handleSaveAll = () => {
    const errors: Record<string, string> = {};
    
    // Validate all editing rows
    editingRows.forEach((rowId) => {
      const rowData = editedData[rowId];
      visibleColumns.forEach((col) => {
        const error = validateField(col.id, rowData[col.id]);
        if (error) {
          errors[`${rowId}-${col.id}`] = error;
        }
      });
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Save all rows
    editingRows.forEach((rowId) => {
      dispatch(updateRow(editedData[rowId]));
    });
    
    setEditingRows(new Set());
    setEditedData({});
    setValidationErrors({});
  };

  const handleCancelAll = () => {
    setEditingRows(new Set());
    setEditedData({});
    setValidationErrors({});
  };

  const handleFieldChange = (rowId: string, field: string, value: string) => {
    const newValue = field === 'age' ? Number(value) : value;
    setEditedData({
      ...editedData,
      [rowId]: {
        ...editedData[rowId],
        [field]: newValue,
      },
    });
    
    // Clear validation error for this field
    const errorKey = `${rowId}-${field}`;
    if (validationErrors[errorKey]) {
      const newErrors = { ...validationErrors };
      delete newErrors[errorKey];
      setValidationErrors(newErrors);
    }
  };

  return (
    <>
      {editingRows.size > 0 && (
        <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            Editing {editingRows.size} row{editingRows.size > 1 ? 's' : ''}
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveAlt />}
            onClick={handleSaveAll}
          >
            Save All
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelOutlined />}
            onClick={handleCancelAll}
          >
            Cancel All
          </Button>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={sortColumn === column.id}
                    direction={sortColumn === column.id ? sortDirection : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => {
              const isEditing = editingRows.has(row.id);
              return (
                <TableRow
                  key={row.id}
                  hover
                  onDoubleClick={() => !isEditing && handleDoubleClick(row)}
                  sx={{ cursor: isEditing ? 'default' : 'pointer' }}
                >
                  {visibleColumns.map((column) => {
                    const errorKey = `${row.id}-${column.id}`;
                    const hasError = !!validationErrors[errorKey];
                    return (
                      <TableCell key={column.id}>
                        {isEditing ? (
                          <TextField
                            size="small"
                            value={editedData[row.id]?.[column.id] || ''}
                            onChange={(e) => handleFieldChange(row.id, column.id, e.target.value)}
                            type={column.id === 'age' ? 'number' : 'text'}
                            fullWidth
                            error={hasError}
                            helperText={hasError ? validationErrors[errorKey] : ''}
                          />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {isEditing ? (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSaveClick(row.id)}
                          >
                            <Save />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleCancelClick(row.id)}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleDoubleClick(row)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(row.id)}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
