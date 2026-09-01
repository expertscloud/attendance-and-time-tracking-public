import { AgGridReact } from 'ag-grid-react';
import { defaultColDef, projectsColDefs } from '@/utils/constants';
import agGridTheme from '@/theme/agGridTheme';
import ActionRenderer from './ActionRenderer';
import BillableRenderer from './BillableRenderer';

const renderers = { ActionRenderer, BillableRenderer };

const ProjectsTable = ({ isLoading, projects }) => {
  return (
    <div style={{ flex: 1 }}>
      <AgGridReact
        theme={agGridTheme}
        loading={isLoading}
        rowData={projects}
        columnDefs={projectsColDefs}
        defaultColDef={defaultColDef}
        components={renderers}
        suppressScrollOnNewData
      />
    </div>
  );
};

export default ProjectsTable;
