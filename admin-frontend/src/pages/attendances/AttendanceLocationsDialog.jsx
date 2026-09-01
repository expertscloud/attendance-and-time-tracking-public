import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DialogContent, Typography, CircularProgress, Box, TextField, Stack } from '@mui/material';
import AppDialog from '@/components/AppDialog';
import { getFormattedDate } from '@/utils/helpers';
import { fetchUsersLocations } from './AttendanceApiCalls';
import UserLocationsMap from '../users/UserLocationsMap';
import InputField from '@/shared/InputField';

const AttendanceLocationsDialog = ({ defaultDate, onClose }) => {
  const [date, setDate] = useState(defaultDate);
  const [searchText, setSearchText] = useState('');

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['users-locations', date],
    queryFn: () => fetchUsersLocations(date),
    enabled: Boolean(date),
  });

  const filteredLocations = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return locations;
    return locations.filter(location => location.fullName?.toLowerCase().includes(keyword));
  }, [locations, searchText]);

  return (
    <AppDialog onClose={onClose} maxWidth="md">
      <DialogContent sx={{ minHeight: 500, py: 4 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6">User Locations</Typography>
          <Stack direction="row" spacing={1}>
            <InputField placeholder="Search here..." value={searchText} onChange={e => setSearchText(e.target.value)} fullWidth={false} />
            <TextField
              type="date"
              label="Date"
              size="small"
              value={date || ''}
              onChange={e => setDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {getFormattedDate(date)} — {filteredLocations.length} location {filteredLocations.length === 1 ? 'entry' : 'entries'}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredLocations.length === 0 ? (
          <Typography sx={{ textAlign: 'center', my: 8 }}>No location snapshots recorded for this date.</Typography>
        ) : (
          <UserLocationsMap locations={filteredLocations} />
        )}
      </DialogContent>
    </AppDialog>
  );
};

export default AttendanceLocationsDialog;
