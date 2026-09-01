export const HEADER_HEIGHT = 60;

export const attendanceStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
};

export const memberStatusMap = {
  [attendanceStatus.ACTIVE]: { colorKey: 'primary', label: 'ACTIVE', isActive: true },
  [attendanceStatus.PAUSED]: { colorKey: 'primaryLight', label: 'PAUSED', isActive: false },
  [attendanceStatus.COMPLETED]: { colorKey: 'info', label: 'COMPLETED', isActive: false },
  default: { colorKey: 'error', label: 'ABSENT', isActive: false },
};

export const genderOptions = [
  { id: 1, name: 'MALE', label: 'Male' },
  { id: 2, name: 'FEMALE', label: 'Female' },
  { id: 3, name: 'OTHER', label: 'Other' },
];
