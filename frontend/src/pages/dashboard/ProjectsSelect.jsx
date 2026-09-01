import { useEffect, useMemo } from 'react';
import { Autocomplete, ListSubheader, Skeleton, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProjectId } from '@/store/reducers/projectsSlice';

const sortByName = projects => projects.toSorted((a, b) => a.name.localeCompare(b.name));

const ProjectsSelect = ({ allProjects, assignedProjects, isLoading }) => {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(state => state.Projects.selectedProjectId);
  const isAttendanceLoading = useSelector(state => state.Attendance.isLoading);

  const assignedIdSet = useMemo(() => new Set(assignedProjects.map(p => p.id)), [assignedProjects]);
  const otherProjects = useMemo(() => allProjects.filter(p => !assignedIdSet.has(p.id)), [allProjects, assignedIdSet]);

  const assignedSorted = useMemo(() => sortByName(assignedProjects), [assignedProjects]);
  const otherSorted = useMemo(() => sortByName(otherProjects), [otherProjects]);

  const groups = useMemo(
    () =>
      [
        { key: 'assigned', label: 'Your Projects', items: assignedSorted },
        { key: 'other', label: 'Other Projects', items: otherSorted },
      ].filter(g => g.items.length > 0),
    [assignedSorted, otherSorted]
  );

  const options = useMemo(() => groups.flatMap(g => g.items), [groups]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return options.find(p => p.id === selectedProjectId) ?? null;
  }, [options, selectedProjectId]);

  useEffect(() => {
    if (isLoading || selectedProjectId === null) return;
    const exists = assignedIdSet.has(selectedProjectId) || otherProjects.some(p => p.id === selectedProjectId);
    if (!exists) dispatch(setSelectedProjectId(null));
  }, [isLoading, assignedIdSet, otherProjects, selectedProjectId, dispatch]);

  if (isLoading) return <Skeleton variant="rounded" height={40} />;

  const hasAny = groups.length > 0;

  const handleChange = (e, newValue) => {
    const newId = newValue?.id ?? null;
    if (newId === selectedProjectId) return;
    dispatch(setSelectedProjectId(newId));
  };

  return (
    <Autocomplete
      fullWidth
      size="small"
      disabled={!hasAny || isAttendanceLoading}
      options={options}
      value={selectedProject}
      disableClearable
      slotProps={{ listbox: { sx: { py: 0 } } }}
      onChange={handleChange}
      getOptionLabel={option => option.name ?? ''}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      groupBy={option => (assignedIdSet.has(option.id) ? 'assigned' : 'other')}
      renderGroup={params => {
        const headerLabel = params.group === 'assigned' ? 'Your Projects' : 'Other Projects';
        return (
          <li key={params.key}>
            <ListSubheader component="div">{headerLabel}</ListSubheader>
            <ul style={{ padding: 0 }}>{params.children}</ul>
          </li>
        );
      }}
      noOptionsText={hasAny ? 'No matching projects' : 'No projects available'}
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Select your project"
          sx={{
            '& .MuiInputBase-input::placeholder': { color: 'rgba(0,0,0,0.42)' },
          }}
        />
      )}
    />
  );
};

export default ProjectsSelect;
