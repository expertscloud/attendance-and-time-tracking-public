import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, CircularProgress, Stack, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AppDialog from '@/components/AppDialog';
import InputField from '@/shared/InputField';
import { getTodayTeamStatus } from './DashboardApiCalls';
import MemberCard from './MemberCard';
import { attendanceStatus } from '@/utils/constants';

const ViewMemberDialog = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['team-status'],
    queryFn: getTodayTeamStatus,
    refetchOnMount: 'always',
  });

  const filteredMembers = useMemo(() => {
    if (statusFilter === 'all' && !searchQuery) return users;

    return users.filter(member => {
      const matchesSearch = member.userName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'absent' && !member.status) return true;

      return member.status === statusFilter;
    });
  }, [users, searchQuery, statusFilter]);

  return (
    <AppDialog onClose={onClose} maxWidth="lg">
      <Box sx={{ p: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 4, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            All Members ({users.length})
          </Typography>

          <Stack direction="row" spacing={2} sx={{ flex: 1, width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <InputField
                name="search"
                placeholder="Search members..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box sx={{ width: 160 }}>
              <InputField name="filter" select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={attendanceStatus.ACTIVE}>Active</MenuItem>
                <MenuItem value={attendanceStatus.PAUSED}>Paused</MenuItem>
                <MenuItem value={attendanceStatus.COMPLETED}>Completed</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
              </InputField>
            </Box>
          </Stack>
        </Stack>

        {isLoading ? (
          <Box sx={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : filteredMembers.length === 0 ? (
          <Box sx={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No team members found.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {filteredMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </Box>
        )}
      </Box>
    </AppDialog>
  );
};

export default ViewMemberDialog;
