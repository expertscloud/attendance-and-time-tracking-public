import { useState } from 'react';
import PaperBox from '@/components/PaperBox';
import LeaveTypesHeader from './LeaveTypesHeader';
import LeaveTypesTable from './LeaveTypesTable';

const LeaveTypes = () => {
  const [searchedText, setSearchedText] = useState('');

  return (
    <PaperBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LeaveTypesHeader searchedText={searchedText} setSearchedText={setSearchedText} />
      <LeaveTypesTable searchedText={searchedText} />
    </PaperBox>
  );
};

export default LeaveTypes;
