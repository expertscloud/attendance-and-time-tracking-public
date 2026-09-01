import { useMemo, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getLocalStorageItem, getPresetRange, setItemInLocalStorage } from '@/utils/helpers';
import DateRangeFilter from '@/shared/DateRangeFilter';
import PaperBox from '@/components/PaperBox';
import UserDetailsInfo from './UserDetailsInfo';
import UserLeavesTab from './UserLeavesTab';
import UserSummaryTab from './UserSummaryTab';

const USER_DETAILS_TAB_KEY = 'userDetailsTab';
const userDetailsTabs = [
  { value: 'summary', label: 'Work Summary' },
  { value: 'leaves', label: 'Leave History' },
];

const getInitialTab = () => {
  const savedTab = getLocalStorageItem(USER_DETAILS_TAB_KEY);
  return userDetailsTabs.some(tab => tab.value === savedTab) ? savedTab : userDetailsTabs[0].value;
};

const UserDetails = () => {
  const { userId } = useParams();
  const parsedUserId = useMemo(() => Number(userId), [userId]);

  const [range, setRange] = useState(() => getPresetRange('YTD'));
  const [selectedTab, setSelectedTab] = useState(getInitialTab);

  const handleTabChange = (_, tab) => {
    setSelectedTab(tab);
    setItemInLocalStorage(USER_DETAILS_TAB_KEY, tab);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
      <UserDetailsInfo parsedUserId={parsedUserId} />

      <PaperBox
        sx={{
          mt: 1,
          boxShadow: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': { fontSize: '1.125rem', fontWeight: 700, minHeight: 56, px: 3 },
            '& .MuiTabs-indicator': { height: 3, borderRadius: 1 },
          }}
        >
          {userDetailsTabs.map(tab => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
        <DateRangeFilter startDate={range.startDate} endDate={range.endDate} onChange={setRange} showReset />
      </PaperBox>

      {selectedTab === 'summary' ? (
        <UserSummaryTab parsedUserId={parsedUserId} range={range} />
      ) : (
        <UserLeavesTab userId={parsedUserId} range={range} />
      )}
    </Box>
  );
};

export default UserDetails;
