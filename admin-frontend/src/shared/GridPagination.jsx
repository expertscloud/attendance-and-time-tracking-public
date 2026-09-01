import { MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import { PAGE_SIZE_OPTIONS } from '@/utils/constants';

const GridPagination = ({ totalPages, page, pageSize, handlePageChange, handlePageSizeChange }) => {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 2, px: 1 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select value={pageSize} onChange={handlePageSizeChange} size="small" variant="outlined">
          {PAGE_SIZE_OPTIONS.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {totalPages ? <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" /> : null}
    </Stack>
  );
};

export default GridPagination;
