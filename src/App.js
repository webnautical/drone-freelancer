// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import CookiesPopup from 'staticspage/Cookies/CookiesPopup';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
      <CookiesPopup />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
