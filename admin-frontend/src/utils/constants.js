import { config } from '@/config/config';

export const userTypeEnum = { SuperAdmin: 1, User: 2, Admin: 3 };

export const userRoleOptions = [
  { value: userTypeEnum.SuperAdmin, label: 'Super Admin' },
  { value: userTypeEnum.User, label: 'User' },
  { value: userTypeEnum.Admin, label: 'Admin' },
];

export const HEADER_HEIGHT = 60;
export const SIDEBAR_WIDTH = 230;
export const COLLAPSED_SIDEBAR_WIDTH = 75;
export const SIDEBAR_TOP_HEADER_AREA = 70;
export const PAGE_SIZE_OPTIONS = [10, config.defaultPageSize, 50, 100, 200, 500];

export const presetOptions = [
  { key: '1M', label: '1M' },
  { key: 'YTD', label: 'YTD' },
];

export const designationOptions = [
  { id: 1, name: 'INTERN', label: 'Intern' },
  { id: 2, name: 'JUNIOR_DEVELOPER', label: 'Junior Developer' },
  { id: 3, name: 'ASSOCIATE_DEVELOPER', label: 'Associate Developer' },
  { id: 4, name: 'SENIOR_DEVELOPER', label: 'Senior Developer' },
  { id: 5, name: 'TEAM_LEAD', label: 'Team Lead' },
  { id: 6, name: 'QA', label: 'QA' },
  { id: 7, name: 'DESIGNER', label: 'Designer' },
  { id: 8, name: 'HR', label: 'HR' },
  { id: 9, name: 'PROJECT_MANAGER', label: 'Project Manager' },
];

export const employmentTypeOptions = [
  { id: 1, name: 'INTERN', label: 'Intern' },
  { id: 2, name: 'PROBATIONARY', label: 'Probationary' },
  { id: 3, name: 'PERMANENT', label: 'Permanent' },
  { id: 4, name: 'CONTRACT', label: 'Contract' },
  { id: 5, name: 'PART_TIME', label: 'Part-Time' },
  { id: 6, name: 'FREELANCER', label: 'Freelancer' },
];

export const workModeOptions = [
  { id: 1, name: 'ON_SITE', label: 'On-Site' },
  { id: 2, name: 'REMOTE', label: 'Remote' },
  { id: 3, name: 'HYBRID', label: 'Hybrid' },
];

export const genderOptions = [
  { id: 1, name: 'MALE', label: 'Male' },
  { id: 2, name: 'FEMALE', label: 'Female' },
  { id: 3, name: 'OTHER', label: 'Other' },
];

export const projectStatusOptions = [
  { id: 1, name: 'PLANNING', label: 'Planning' },
  { id: 2, name: 'IN_PROGRESS', label: 'In Progress' },
  { id: 3, name: 'ON_HOLD', label: 'On Hold' },
  { id: 4, name: 'COMPLETED', label: 'Completed' },
  { id: 5, name: 'CANCELLED', label: 'Cancelled' },
];

export const defaultColDef = {
  filter: false,
  flex: 1,
  minWidth: 120,
  // cellStyle: { textAlign: 'center' },
};

export const projectsColDefs = [
  {
    headerName: 'Name',
    colId: 'name',
    field: 'name',
    pinned: 'left',
    width: 170,
  },
  {
    headerName: 'Short Code',
    colId: 'shortCode',
    field: 'shortCode',
  },
  {
    headerName: 'Client',
    colId: 'client',
    valueGetter: params => params.data?.client?.name || '',
  },
  {
    headerName: 'Team Lead',
    colId: 'teamLead',
    valueGetter: params => params.data?.teamLead?.fullName || '',
  },
  {
    headerName: 'Status',
    colId: 'status',
    valueGetter: params => params.data?.status?.label || '',
  },
  {
    headerName: 'Billable',
    colId: 'isBillable',
    field: 'isBillable',
    cellRenderer: 'BillableRenderer',
  },
  {
    headerName: 'Start Date',
    colId: 'startDate',
    field: 'startDate',
  },
  {
    headerName: 'Planned End',
    colId: 'plannedEndDate',
    field: 'plannedEndDate',
  },
  {
    headerName: 'Action',
    colId: 'action',
    field: 'id',
    cellRenderer: 'ActionRenderer',
    pinned: 'right',
    maxWidth: 120,
  },
];

export const clientsColDefs = [
  {
    headerName: 'Name',
    colId: 'name',
    field: 'name',
    pinned: 'left',
    width: 170,
  },
  {
    headerName: 'Email',
    colId: 'email',
    field: 'email',
  },
  {
    headerName: 'Phone',
    colId: 'phone',
    field: 'phone',
  },
  {
    headerName: 'Website',
    colId: 'website',
    field: 'website',
  },
  {
    headerName: 'City',
    colId: 'city',
    field: 'city',
  },
  {
    headerName: 'Country',
    colId: 'country',
    field: 'country',
  },
  {
    headerName: 'Created At',
    colId: 'createdAt',
    field: 'createdAt',
  },
  {
    headerName: 'Action',
    colId: 'action',
    field: 'id',
    cellRenderer: 'ActionRenderer',
    pinned: 'right',
    maxWidth: 120,
  },
];

export const usersColDefs = [
  {
    headerName: 'Name',
    colId: 'fullName',
    field: 'fullName',
    pinned: 'left',
    width: 250,
    cellRenderer: 'NameRenderer',
  },
  {
    headerName: 'Email',
    colId: 'email',
    field: 'email',
    flex: 0,
  },
  {
    headerName: 'Designation',
    colId: 'designation',
    valueGetter: params => params.data?.designation?.label || '',
  },
  {
    headerName: 'Employment Type',
    colId: 'employmentType',
    valueGetter: params => params.data?.employmentType?.label || '',
  },
  {
    headerName: 'Work Mode',
    colId: 'workMode',
    valueGetter: params => params.data?.workMode?.label || '',
  },
  {
    headerName: 'Status',
    colId: 'isActive',
    field: 'isActive',
    cellRenderer: 'StatusRenderer',
  },
  {
    headerName: 'Date of Birth',
    colId: 'dob',
    field: 'dob',
  },
  {
    headerName: 'Gender',
    colId: 'gender',
    valueGetter: params => params.data?.gender?.label || '',
  },
  {
    headerName: 'Phone Number',
    colId: 'phoneNumber',
    field: 'phoneNumber',
    flex: 0,
  },
  {
    headerName: 'Emergency Contact',
    colId: 'emergencyContactNumber',
    field: 'emergencyContactNumber',
    flex: 0,
  },
  {
    headerName: 'Address',
    colId: 'address',
    field: 'address',
  },
  {
    headerName: 'Joining Date',
    colId: 'joiningDate',
    field: 'joiningDate',
  },
  {
    headerName: 'Employee ID',
    colId: 'employeeId',
    field: 'employeeId',
  },
  {
    headerName: 'Is Admin',
    colId: 'isAdmin',
    field: 'type',
    cellRenderer: 'AdminRenderer',
    maxWidth: 100,
  },
  {
    headerName: 'Action',
    colId: 'action',
    field: 'id',
    cellRenderer: 'ActionRenderer',
    pinned: 'right',
    maxWidth: 160,
  },
];

export const leaveTypesColDefs = [
  { headerName: 'Leave Type Name', field: 'label', cellRenderer: 'LeaveTypeNameRenderer' },
  {
    headerName: 'Annual Allowed Days',
    field: 'allowance',
    valueFormatter: params => `${params.value} ${params.value === 1 ? 'Day' : 'Days'}`,
  },
  { headerName: 'Actions', field: 'actions', flex: 0, cellRenderer: 'ActionRenderer' },
];

export const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const WEEKDAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ATTENDANCE_HIGHLIGHT_COLORS = {
  shortDayWarning: 'rgba(244, 67, 54, 0.35)',
  shortDayMild: 'rgba(255, 152, 0, 0.2)',
  idle: 'rgba(103, 58, 183, 0.22)',
};

export const ATTENDANCE_LEGEND_ITEMS = [
  {
    color: ATTENDANCE_HIGHLIGHT_COLORS.idle,
    label: `Name highlighted: User idle for over ${config.attendanceUpdateThresholdInMinutes} minutes`,
  },
  { color: ATTENDANCE_HIGHLIGHT_COLORS.shortDayWarning, label: `Worked under ${config.warningShortDayHours} hours` },
  { color: ATTENDANCE_HIGHLIGHT_COLORS.shortDayMild, label: `Worked under ${config.mildShortDayHours} hours` },
];
