'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addRow } from '@/lib/redux/slices/tableSlice';

interface AddRowDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddRowDialog({ open, onClose }: AddRowDialogProps) {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.table.columns);
  const rows = useAppSelector((state) => state.table.rows);

  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    email: '',
    age: '',
    role: 'Developer',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = ['Developer', 'Designer', 'Manager', 'Analyst'];

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    // Validate age
    const age = Number(formData.age);
    if (!formData.age || isNaN(age) || age < 0 || age > 150) {
      newErrors.age = 'Age must be a number between 0 and 150';
    }

    // Validate role
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Generate new ID
    const newId = String(rows.length + 1);

    // Create new row with all columns
    const newRow: any = {
      id: newId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: Number(formData.age),
      role: formData.role,
    };

    // Add any custom columns with empty values
    columns.forEach((col) => {
      if (!['id', 'name', 'email', 'age', 'role'].includes(col.id)) {
        newRow[col.id] = formData[col.id] || '';
      }
    });

    dispatch(addRow(newRow));

    // Reset form
    setFormData({
      name: '',
      email: '',
      age: '',
      role: 'Developer',
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      role: 'Developer',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Row</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />

          <TextField
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            error={!!errors.age}
            helperText={errors.age}
            fullWidth
            required
          />

          <TextField
            label="Role"
            select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            error={!!errors.role}
            helperText={errors.role}
            fullWidth
            required
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          {/* Dynamic fields for custom columns */}
          {columns
            .filter((col) => !['id', 'name', 'email', 'age', 'role'].includes(col.id))
            .map((col) => (
              <TextField
                key={col.id}
                label={col.label}
                value={formData[col.id] || ''}
                onChange={(e) => handleChange(col.id, e.target.value)}
                fullWidth
              />
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Row
        </Button>
      </DialogActions>
    </Dialog>
  );
}
