'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  List,
  ListItem,
  Typography,
  IconButton,
} from '@mui/material';
import { DragIndicator, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleColumnVisibility, addColumn, reorderColumns, deleteColumn } from '@/lib/redux/slices/tableSlice';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ManageColumnsDialogProps {
  open: boolean;
  onClose: () => void;
}

function SortableColumnItem({ column, onToggle, onDelete, isDefault }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
        <DragIndicator />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={column.visible}
            onChange={() => onToggle(column.id)}
          />
        }
        label={column.label}
        sx={{ flex: 1 }}
      />
      {!isDefault && (
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(column.id)}
        >
          <Delete fontSize="small" />
        </IconButton>
      )}
    </ListItem>
  );
}

export default function ManageColumnsDialog({ open, onClose }: ManageColumnsDialogProps) {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.table.columns);
  const [newColumnName, setNewColumnName] = useState('');

  const defaultColumnIds = ['name', 'email', 'age', 'role'];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggle = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
      
      // Check if column already exists
      if (columns.find(col => col.id === columnId)) {
        alert('Column already exists!');
        return;
      }
      
      dispatch(
        addColumn({
          id: columnId,
          label: newColumnName,
          visible: true,
        })
      );
      setNewColumnName('');
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm(`Are you sure you want to delete the "${columnId}" column? This will remove all data in this column.`)) {
      dispatch(deleteColumn(columnId));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);

      const newColumns = arrayMove(columns, oldIndex, newIndex);
      dispatch(reorderColumns(newColumns));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add custom columns to your table
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="New Column Name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              fullWidth
              size="small"
              placeholder="e.g., Department, Location"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddColumn();
                }
              }}
            />
            <Button
              onClick={handleAddColumn}
              variant="contained"
              disabled={!newColumnName.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Drag to reorder, check to show/hide columns
        </Typography>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={verticalListSortingStrategy}
          >
            <List sx={{ p: 0 }}>
              {columns.map((column) => (
                <SortableColumnItem
                  key={column.id}
                  column={column}
                  onToggle={handleToggle}
                  onDelete={handleDeleteColumn}
                  isDefault={defaultColumnIds.includes(column.id)}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
