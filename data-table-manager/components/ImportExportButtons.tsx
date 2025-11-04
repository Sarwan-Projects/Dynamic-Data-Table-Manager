'use client';

import { Button, Box, Alert, Snackbar, Stack, useTheme, alpha } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setRows } from '@/lib/redux/slices/tableSlice';

export default function ImportExportButtons() {
  const dispatch = useAppDispatch();
  const { rows, columns } = useAppSelector((state) => state.table);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const theme = useTheme();

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const importedRows = results.data.map((row: any, index: number) => ({
            id: row.id || `imported-${Date.now()}-${index}`,
            name: row.name || '',
            email: row.email || '',
            age: Number(row.age) || 0,
            role: row.role || '',
            ...row,
          }));

          dispatch(setRows(importedRows));
          setSuccess(`Successfully imported ${importedRows.length} rows!`);
        } catch (err) {
          setError('Failed to parse CSV file. Please check the format.');
        }
      },
      error: () => {
        setError('Failed to read CSV file.');
      },
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    const visibleColumns = columns.filter((col) => col.visible);
    const exportData = rows.map((row) => {
      const exportRow: any = {};
      visibleColumns.forEach((col) => {
        exportRow[col.label] = row[col.id];
      });
      return exportRow;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `table-export-${Date.now()}.csv`);
    setSuccess(`Successfully exported ${rows.length} rows!`);
  };

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          startIcon={<Upload />}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            borderRadius: 2,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Import CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          sx={{
            borderRadius: 2,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Export CSV
        </Button>
      </Stack>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} variant="filled">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)} variant="filled">
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}
