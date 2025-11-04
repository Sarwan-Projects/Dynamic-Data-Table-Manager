'use client';

import { Container, Box, Typography, Button, Paper, Stack, Chip, useTheme, alpha } from '@mui/material';
import { Settings, TableChart, Add } from '@mui/icons-material';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import SearchBar from '@/components/SearchBar';
import ImportExportButtons from '@/components/ImportExportButtons';
import ManageColumnsDialog from '@/components/ManageColumnsDialog';
import AddRowDialog from '@/components/AddRowDialog';
import ThemeToggle from '@/components/ThemeToggle';
import { useAppSelector } from '@/lib/redux/hooks';

export default function Home() {
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const theme = useTheme();
  const rows = useAppSelector((state) => state.table.rows);
  const visibleColumns = useAppSelector((state) => state.table.columns.filter(c => c.visible));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 3,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TableChart sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Data Table Manager
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={`${rows.length} Rows`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`${visibleColumns.length} Columns`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Box>
            <ThemeToggle />
          </Box>

          {/* Controls Section */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 300 } }}>
              <SearchBar />
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => setAddRowOpen(true)}
                sx={{
                  boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                  '&:hover': {
                    boxShadow: `0 6px 25px ${alpha(theme.palette.success.main, 0.5)}`,
                  },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Add Row
              </Button>
              <ImportExportButtons />
              <Button
                variant="contained"
                startIcon={<Settings />}
                onClick={() => setManageColumnsOpen(true)}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  '&:hover': {
                    boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Manage Columns
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Table Section */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
          }}
        >
          <DataTable />
        </Paper>

        <ManageColumnsDialog
          open={manageColumnsOpen}
          onClose={() => setManageColumnsOpen(false)}
        />
        
        <AddRowDialog
          open={addRowOpen}
          onClose={() => setAddRowOpen(false)}
        />
      </Container>
    </Box>
  );
}
