import { useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { leaveTypesColDefs, defaultColDef } from '@/utils/constants';
import agGridTheme from '@/theme/agGridTheme';
import ActionRenderer from './ActionRenderer';
import LeaveTypeNameRenderer from './LeaveTypeNameRenderer';

const renderers = { ActionRenderer, LeaveTypeNameRenderer };

const LeaveTypesTable = ({ searchedText }) => {
  const leaveTypes = useSelector(state => state.MasterData.leaveTypes);

  return (
    <AgGridReact
      theme={agGridTheme}
      rowData={leaveTypes}
      columnDefs={leaveTypesColDefs}
      defaultColDef={defaultColDef}
      quickFilterText={searchedText}
      components={renderers}
      suppressCellFocus
    />
  );
};

export default LeaveTypesTable;
