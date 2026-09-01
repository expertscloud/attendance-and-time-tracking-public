import { useState } from 'react';
import { alpha, Box, Button, Skeleton, Stack, Switch, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddTaskIcon from '@mui/icons-material/AddTask';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import ProjectsSelect from './ProjectsSelect';
import AddProjectDialog from './AddProjectDialog';
import InputField from '@/shared/InputField';
import { setIsBillable, setSelectedProjectNotes } from '@/store/reducers/projectsSlice';
import { getAllProjects, getUserProjects, getUserSelectedProject } from './DashboardApiCalls';
import { startNewTask } from './AttendanceApiCalls';

const SectionLabel = ({ icon: Icon, children, action }) => (
  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75, minHeight: 28 }}>
    <Stack direction="row" spacing={0.75}>
      {Icon ? <Icon sx={{ fontSize: 16 }} /> : null}
      <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {children}
      </Typography>
    </Stack>
    {action}
  </Stack>
);

const WorkDetail = ({ isTimerRunning }) => {
  const dispatch = useDispatch();
  const [addProjectOpen, setAddProjectOpen] = useState(false);

  const selectedProjectId = useSelector(state => state.Projects.selectedProjectId);
  const selectedProjectNotes = useSelector(state => state.Projects.selectedProjectNotes);
  const isBillable = useSelector(state => state.Projects.isBillable);
  const isDirty = useSelector(state => state.Projects.isDirty);
  const isAttendanceLoading = useSelector(state => state.Attendance.isLoading);

  const allProjectsQuery = useQuery({ queryKey: ['all-projects'], queryFn: getAllProjects });
  const assignedProjectsQuery = useQuery({ queryKey: ['assigned-projects'], queryFn: getUserProjects });
  const selectedProjectQuery = useQuery({ queryKey: ['selected-projects'], queryFn: getUserSelectedProject });

  const isLoading = allProjectsQuery.isLoading || assignedProjectsQuery.isLoading || selectedProjectQuery.isLoading;
  const canStartNewTask = !!selectedProjectId && isDirty && !isAttendanceLoading;

  return (
    <>
      <Stack spacing={1.5}>
        <Stack>
          <SectionLabel
            icon={WorkOutlineIcon}
            action={
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon sx={{ fontSize: '14px !important' }} />}
                onClick={() => setAddProjectOpen(true)}
                sx={{ bgcolor: theme => alpha(theme.palette.primary.main, 0.1), height: '28px' }}
              >
                Add Project
              </Button>
            }
          >
            Project
          </SectionLabel>
          <ProjectsSelect
            allProjects={allProjectsQuery.data ?? []}
            assignedProjects={assignedProjectsQuery.data ?? []}
            isLoading={isLoading}
          />
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Box sx={{ flex: 7 }}>
            {isLoading ? (
              <Skeleton variant="rounded" height={86} />
            ) : (
              <InputField
                rows={2}
                placeholder="Add a note about your current task — e.g. “Fixing the login page layout”"
                value={selectedProjectNotes}
                onChange={e => dispatch(setSelectedProjectNotes(e.target.value))}
              />
            )}
          </Box>
          <Box sx={{ flex: 2 }}>
            {isLoading ? (
              <Skeleton variant="rounded" height={86} />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: 1.5,
                  bgcolor: 'transparent',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: theme => alpha(theme.palette.action.active, 0.23),
                  cursor: 'pointer',
                }}
                onClick={() => dispatch(setIsBillable(!isBillable))}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.75 }}>
                  Is billable
                </Typography>
                <Box sx={{ ml: -1.5 }}>
                  <Switch
                    checked={Boolean(isBillable)}
                    onChange={e => dispatch(setIsBillable(e.target.checked))}
                    color="primary"
                    sx={{ pointerEvents: 'none' }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Stack>

        {isTimerRunning ? (
          <Stack spacing={0.5}>
            <Tooltip
              title={isDirty ? '' : 'Change the project, notes, or billable status above to start a new task'}
              arrow
              placement="top"
              disableHoverListener={isDirty}
            >
              <Box component="span" sx={{ width: '100%', display: 'block' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={!canStartNewTask}
                  startIcon={<AddTaskIcon />}
                  onClick={startNewTask}
                  sx={{ fontWeight: 600, bgcolor: theme => alpha(theme.palette.primary.main, 0.08) }}
                >
                  Start New Task
                </Button>
              </Box>
            </Tooltip>
          </Stack>
        ) : null}
      </Stack>

      {addProjectOpen && <AddProjectDialog onClose={() => setAddProjectOpen(false)} />}
    </>
  );
};

export default WorkDetail;
