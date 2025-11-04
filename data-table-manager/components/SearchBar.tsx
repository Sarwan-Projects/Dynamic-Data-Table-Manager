'use client';

import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setSearchQuery } from '@/lib/redux/slices/tableSlice';

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.table.searchQuery);

  return (
    <TextField
      placeholder="Search all fields..."
      value={searchQuery}
      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      size="small"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
}
