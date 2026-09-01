import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import PaperBox from '@/components/PaperBox';
import GridPagination from '@/shared/GridPagination';
import { setPage, setPageSize } from '@/store/reducers/projectsSlice';
import ProjectsHeader from './ProjectsHeader';
import ProjectsTable from './ProjectsTable';
import { fetchProjects } from './ProjectsApiCalls';

const Projects = () => {
  const dispatch = useDispatch();
  const page = useSelector(state => state.Projects.page);
  const pageSize = useSelector(state => state.Projects.pageSize);
  const searchedText = useSelector(state => state.Projects.searchedText);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['projects', { searchedText, pageSize, page }],
    queryFn: () => fetchProjects({ searchedText, pageSize, page }),
  });

  const handlePageChange = (_, value) => dispatch(setPage(value));
  const handlePageSizeChange = e => dispatch(setPageSize(Number(e.target.value)));

  return (
    <PaperBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ProjectsHeader refetch={refetch} isFetching={isRefetching || isLoading} />
      <ProjectsTable isLoading={isLoading} projects={data?.projects || []} />
      <GridPagination
        totalPages={data?.totalPages || 0}
        page={page}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    </PaperBox>
  );
};

export default Projects;
