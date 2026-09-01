import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { defaultColDef } from '@/utils/constants';
import agGridTheme from '@/theme/agGridTheme';
import AttendanceCellRenderer from './AttendanceCellRenderer';
import LeaveDialog from './LeaveDialog';

const renderers = { AttendanceCellRenderer };

const AttendanceTable = ({ isLoading, users = [], columnDefs, searchedText, refetch }) => {
  const [selectedCellData, setSelectedCellData] = useState(null);

  const handleCellClicked = params => {
    if (params.colDef.field === 'fullName') return;
    if (!params.value?.checkIn || params.value?.leave) {
      setSelectedCellData(params);
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <AgGridReact
        theme={agGridTheme}
        loading={isLoading}
        rowData={users}
        quickFilterText={searchedText}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        components={renderers}
        enableBrowserTooltips
        suppressScrollOnNewData
        onCellClicked={handleCellClicked}
      />
      {selectedCellData ? <LeaveDialog onClose={() => setSelectedCellData(null)} cellData={selectedCellData} refetch={refetch} /> : null}
    </div>
  );
};

export default AttendanceTable;
