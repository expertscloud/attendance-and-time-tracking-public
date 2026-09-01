import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import PaperBox from '@/components/PaperBox';
import GridPagination from '@/shared/GridPagination';
import { setPage, setPageSize } from '@/store/reducers/usersSlice';
import UsersHeader from './UsersHeader';
import UsersTable from './UsersTable';
import { fetchUsers } from './UsersApiCalls';

const Users = () => {
  const dispatch = useDispatch();
  const page = useSelector(state => state.Users.page);
  const pageSize = useSelector(state => state.Users.pageSize);
  const searchedText = useSelector(state => state.Users.searchedText);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['users-listing-page', { searchedText, pageSize, page }],
    queryFn: () => fetchUsers({ searchedText, pageSize, page }),
  });

  const handlePageChange = (_, value) => dispatch(setPage(value));
  const handlePageSizeChange = e => dispatch(setPageSize(Number(e.target.value)));

  return (
    <PaperBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <UsersHeader refetch={refetch} isFetching={isRefetching || isLoading} />
      <UsersTable isLoading={isLoading} users={data?.users || []} />
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

export default Users;
