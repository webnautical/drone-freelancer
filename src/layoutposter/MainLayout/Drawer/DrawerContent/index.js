// project import
// import NavCard from './NavCard';
import SimpleBar from 'components/third-party/SimpleBar';
import Navigation from './Navigation/index';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column'
      }
    }}
  >
    <Navigation />
    {/* <NavCard /> */}
  </SimpleBar>
);

export default DrawerContent;
