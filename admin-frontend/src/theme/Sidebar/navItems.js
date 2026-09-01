import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';

export const navItems = [
  {
    type: 'label',
    label: 'Administration',
  },
  {
    name: 'Attendance',
    path: '/attendance',
    icon: ListAltIcon,
  },
  {
    name: 'Leaves',
    path: '/leaves',
    icon: ListAltIcon,
  },
  {
    name: 'Leave Types',
    path: '/leave-types',
    icon: CategoryIcon,
  },
  {
    name: 'Users',
    path: '/users',
    icon: PeopleIcon,
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: AssignmentIcon,
  },
  {
    name: 'Clients',
    path: '/clients',
    icon: BusinessIcon,
  },
];
