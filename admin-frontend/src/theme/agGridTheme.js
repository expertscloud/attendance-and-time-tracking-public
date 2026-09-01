import { themeQuartz } from 'ag-grid-community';

// Shared ag-grid theme: alternating row colors tinted with the app's primary color (#063465)
const agGridTheme = themeQuartz.withParams({
  oddRowBackgroundColor: 'rgba(6, 52, 101, 0.03)',
});

export default agGridTheme;
