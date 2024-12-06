import '../App.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import {useEffect} from 'react';
// import Home from './Home/Home';
import Newhome from './Home/Newhome';
function Mainpage() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className="App">
      {/* <Home /> */}
      <Newhome />
    </div>
  );
}

export default Mainpage;
