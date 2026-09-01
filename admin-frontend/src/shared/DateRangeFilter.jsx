import { Button, ButtonGroup, Stack, TextField } from '@mui/material';
import { presetOptions } from '@/utils/constants';
import { getPresetRange } from '@/utils/helpers';

const DateRangeFilter = ({ startDate, endDate, onChange, showReset = false }) => {
  const applyPreset = key => onChange(getPresetRange(key));

  const handleStartChange = e => onChange({ startDate: e.target.value, endDate });
  const handleEndChange = e => onChange({ startDate, endDate: e.target.value });

  const activePresetKey = presetOptions.find(p => {
    const range = getPresetRange(p.key);
    return range.startDate === startDate && range.endDate === endDate;
  })?.key;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
      <ButtonGroup size="small" variant="outlined" sx={{ flexWrap: 'wrap' }}>
        {presetOptions.map(p => (
          <Button key={p.key} onClick={() => applyPreset(p.key)} variant={activePresetKey === p.key ? 'contained' : 'outlined'}>
            {p.label}
          </Button>
        ))}
      </ButtonGroup>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <TextField
          type="date"
          size="small"
          value={startDate || ''}
          onChange={handleStartChange}
          slotProps={{ inputLabel: { shrink: true } }}
          label="From"
          sx={{ width: 160 }}
        />
        <TextField
          type="date"
          size="small"
          value={endDate || ''}
          onChange={handleEndChange}
          slotProps={{ inputLabel: { shrink: true } }}
          label="To"
          sx={{ width: 160 }}
        />
        {showReset ? (
          <Button variant="contained" size="small" onClick={() => applyPreset('YTD')} sx={{ whiteSpace: 'nowrap', px: 2 }}>
            Reset
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default DateRangeFilter;
