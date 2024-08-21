import '../App.css';
import Home from './Home/Home';

// import Faq from "./FAQ/Faq";
// import Aboutus from "./Aboutus/Aboutus";
// import Findpilot from "./Findpilot/Findpilot";
// import Pricing from "./Pricing/Pricing";
// import AOS from "aos";
import 'aos/dist/aos.css';
import AOS from 'aos';
// import Blogs from "./Blogs/Blogs";

import {
  // useState,
  useEffect
} from 'react';
// import LoaderCom from 'utils/LoaderCom';
// import ClipLoader from "react-spinners/ClipLoader";
// import Lostpet from "./Lostpet/Lostpet";
// import Signin from "./login/Signin";
// import { Login } from "@mui/icons-material";
// import Signup from "./createaccouont/Signup";
// import Signuptwo from "./signup2/Signuptwo";

function Mainpage() {
  //   const [loading, setLoading] = useState(false);
  //   useEffect(() => {
  //     setLoading(false);
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 5000);
  //   }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default Mainpage;
