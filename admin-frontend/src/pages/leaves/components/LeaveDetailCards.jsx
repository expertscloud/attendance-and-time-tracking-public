import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import PaperBox from '@/components/PaperBox';
import LeaveCard from './LeaveCard';

const LeaveDetailCards = ({ summary = {} }) => {
  const leaveTypes = useSelector(state => state.MasterData.leaveTypes);

  const cards = leaveTypes.map(type => ({ label: type.label, color: type.color, count: summary[type.id] }));

  cards.push({ label: 'Total (Without WFH)', count: summary.totalWithoutWFH }, { label: 'Total', count: summary.total });

  return (
    <PaperBox>
      <Grid container spacing={2}>
        {cards.map(card => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 1.7 }}>
            <LeaveCard label={card.label} count={card.count} color={card.color} />
          </Grid>
        ))}
      </Grid>
    </PaperBox>
  );
};

export default LeaveDetailCards;
