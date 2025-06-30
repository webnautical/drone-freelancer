

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'simplebar/src/simplebar.css';
import { Provider as ReduxProvider } from 'react-redux';
import 'assets/third-party/apex-chart.css';
import LoginAdmin from './LoginAdmin';
import LoginUser from './pilot/Login';
import Mainpage from 'staticspage/Mainpage';
import About from './staticspage/Aboutus/Aboutus';
import Privacy from './staticspage/privacy/Privacy';
import TermsAndcondition from './staticspage/privacy/Temscondition';
import Register from './staticspage/createaccouont/Signup';
import Registers from './staticspage/signup2/Signuptwo';
import Faq from './staticspage/FAQ/Faq';
import Pricing from './staticspage/Pricing/Pricing';
import AnimalRescue from './staticspage/Lostpet/Lostpet';
// project import
import App from './App';
import { store } from 'store';
import { stores } from 'stores';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pilotmap from 'staticspage/Pilotmap/Pilotmap111';
import Front from 'Front';
import Marketplace from 'staticspage/Marketplace/Marketplace';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from 'staticspage/Auth/ForgotPassword';
import MarketPlaceDetails from 'staticspage/Marketplace/MarketPlaceDetails';
import CookiesPopup from 'staticspage/Cookies/CookiesPopup';
// ==============================|| MAIN - REACT DOM RENDER  ||============================== //
import { LoadScript } from '@react-google-maps/api';
import { libraries } from 'Utility/Utility';
import ProfileDetails from 'staticspage/Pilotmap/ProfileDetails';
import Contactus from 'staticspage/Contactus/Contactus';
import Whydronmatchmaker from 'staticspage/privacy/Whydronmatchmaker';
import Howitwork from 'staticspage/privacy/Howitwork';
import FormIndex from 'staticspage/Form/index';
import PilotList from 'staticspage/Pilotmap/PilotList';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Newhome from 'staticspage/Home/Newhome';
import SuccessPage from 'staticspage/SuccessPage';
// import NotFound from 'Utility/NotFound';
// const stripePromise = loadStripe('pk_test_51PPi6VKc8CNsxNnE0tXJjUGr8pPvuSzncsDVMjyzrXyguJK9prbJdKBfyvdWPNxRgNgYidtr2chDkRejRKZFN8F900yJb3JEhE');
const stripePromise = loadStripe('pk_live_51PPi6VKc8CNsxNnEKl4sXhOlDWoWMkxk3dTzolMRrD61VAXVOX3JER5HZORGmEtmyTteHIHk8QwIMf3E0v6rczZB00COjSh9DL');
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <LoadScript googleMapsApiKey="AIzaSyCX8PtZWvDsQC0qKsVvJ9vFj6rfo-OmHWM" libraries={libraries} loadingElement={<div style={{ display: "none" }} />}>

      <Elements stripe={stripePromise}>
        <ReduxProvider store={stores}>
          <Routes>
            <Route path="/user/" element={<LoginUser />} />
            <Route path="/user/*" element={<App />} />
          </Routes>
        </ReduxProvider>

        <ReduxProvider store={store}>
          <Routes>
            <Route path="/admin/" element={<LoginAdmin />} />
            <Route path="/admin/*" element={<App />} />
          </Routes>
        </ReduxProvider>

        <ReduxProvider store={store}>
          <Routes>
            <Route path="/new-home" element={<Front cmp={Newhome} />} />
            <Route path="/" element={<Front cmp={Mainpage} />} />
            <Route path="/about" element={<Front cmp={About} />} />
            <Route path="/plans" element={<Front cmp={Pricing} />} />
            <Route path="/privacy&cookies" element={<Front cmp={Privacy} />} />
            <Route path="/pilot-map" element={<Front cmp={Pilotmap} />} />
            <Route path="/terms-condition" element={<Front cmp={TermsAndcondition} />} />
            <Route path="/profile-details/:id" element={<Front cmp={ProfileDetails} />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registers" element={<Registers />} />
            <Route path="/faq" element={<Front cmp={Faq} />} />
            <Route path="/how-it-works" element={<Front cmp={Howitwork} />} />
            <Route path="/why-drone-freelancer" element={<Front cmp={Whydronmatchmaker} />} />
            <Route path="/marketplace" element={<Front cmp={Marketplace} />} />
            <Route path="/contact-us" element={<Front cmp={Contactus} />} />

            <Route path="/pilot-directory/:state" element={<Front cmp={PilotList} />} />
            <Route path="/pilot-directory" element={<Front cmp={() => <PilotList />} />} />
            <Route path="/marketplace-details" element={<Front cmp={MarketPlaceDetails} />} />
            <Route path="/animal-rescue" element={<Front cmp={AnimalRescue} />} />
            <Route path="/page" element={<Front cmp={FormIndex} />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route path="/success" element={<Front cmp={SuccessPage} />} />

          </Routes>
          <CookiesPopup />
          <ToastContainer />
        </ReduxProvider>
      </Elements>

    </LoadScript>
  </BrowserRouter>
);

reportWebVitals();