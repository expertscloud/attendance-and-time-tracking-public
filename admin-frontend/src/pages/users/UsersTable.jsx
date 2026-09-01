import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { defaultColDef, usersColDefs } from '@/utils/constants';
import agGridTheme from '@/theme/agGridTheme';
import ActionRenderer from './ActionRenderer';
import AdminRenderer from './AdminRenderer';
import StatusRenderer from './StatusRenderer';
import NameRenderer from './NameRenderer';

const renderers = { NameRenderer, ActionRenderer, AdminRenderer, StatusRenderer };

const UsersTable = ({ isLoading, users }) => {
  const navigate = useNavigate();

  const handleCellClicked = params => {
    if (params.column?.colId === 'action' || params.column?.colId === 'isAdmin') return;
    if (params.data?.id) navigate(`/users/details/${params.data.id}`);
  };

  return (
    <div style={{ flex: 1 }}>
      <AgGridReact
        theme={agGridTheme}
        loading={isLoading}
        rowData={users}
        columnDefs={usersColDefs}
        defaultColDef={defaultColDef}
        components={renderers}
        onCellClicked={handleCellClicked}
        rowStyle={{ cursor: 'pointer' }}
        suppressScrollOnNewData
      />
    </div>
  );
};

export default UsersTable;
