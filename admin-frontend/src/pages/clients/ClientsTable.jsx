import { AgGridReact } from 'ag-grid-react';
import { defaultColDef, clientsColDefs } from '@/utils/constants';
import agGridTheme from '@/theme/agGridTheme';
import ActionRenderer from './ActionRenderer';

const renderers = { ActionRenderer };

const ClientsTable = ({ isLoading, clients }) => {
  return (
    <div style={{ flex: 1 }}>
      <AgGridReact
        theme={agGridTheme}
        loading={isLoading}
        rowData={clients}
        columnDefs={clientsColDefs}
        defaultColDef={defaultColDef}
        components={renderers}
        suppressScrollOnNewData
      />
    </div>
  );
};

export default ClientsTable;
