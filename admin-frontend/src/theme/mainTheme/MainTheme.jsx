import Header from '@/theme/header/Header';
import Sidebar from '@/theme/Sidebar/Sidebar';
import MainBody from './MainBody';

const MainTheme = () => {
  return (
    <>
      <Sidebar />
      <Header />
      <MainBody />
    </>
  );
};

export default MainTheme;
