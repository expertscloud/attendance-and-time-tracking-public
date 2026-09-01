import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { defaultColDef } from '@/utils/constants';
import agGridTheme from '@/theme/agGridTheme';
import ActionRenderer from './ActionRenderer';
import LeaveCellRenderer from './LeaveCellRenderer';

export const getLeavesColDefs = (leaveTypes = []) => {
  const dynamicLeaveCols = (leaveTypes || []).map(type => ({
    headerName: type.label,
    colId: String(type.id),
    cellRenderer: 'LeaveCellRenderer',
  }));

  return [
    { headerName: 'Employee', field: 'fullName', minWidth: 200 },
    ...dynamicLeaveCols,
    { headerName: 'Total (Without WFH)', field: 'totalWithoutWFH' },
    { headerName: 'Total', field: 'total' },
    { headerName: 'Actions', cellRenderer: 'ActionRenderer', maxWidth: 120 },
  ];
};

const renderers = { ActionRenderer, LeaveCellRenderer };

const LeavesTable = ({ isLoading, users = [], searchedText }) => {
  const leaveTypes = useSelector(state => state.MasterData.leaveTypes);
  const columnDefs = useMemo(() => getLeavesColDefs(leaveTypes), [leaveTypes]);

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
      />
    </div>
  );
};

export default LeavesTable;
