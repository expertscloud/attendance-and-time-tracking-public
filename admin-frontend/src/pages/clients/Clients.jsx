import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import PaperBox from '@/components/PaperBox';
import GridPagination from '@/shared/GridPagination';
import { setPage, setPageSize } from '@/store/reducers/clientsSlice';
import ClientsHeader from './ClientsHeader';
import ClientsTable from './ClientsTable';
import { fetchClients } from './ClientsApiCalls';

const Clients = () => {
  const dispatch = useDispatch();
  const page = useSelector(state => state.Clients.page);
  const pageSize = useSelector(state => state.Clients.pageSize);
  const searchedText = useSelector(state => state.Clients.searchedText);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['clients', { searchedText, pageSize, page }],
    queryFn: () => fetchClients({ searchedText, pageSize, page }),
  });

  const handlePageChange = (_, value) => dispatch(setPage(value));
  const handlePageSizeChange = e => dispatch(setPageSize(Number(e.target.value)));

  return (
    <PaperBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ClientsHeader refetch={refetch} isFetching={isRefetching || isLoading} />
      <ClientsTable isLoading={isLoading} clients={data?.clients || []} />
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

export default Clients;
