import { toast } from 'react-toastify';
var CryptoJS = require('crypto-js');
import Profile from '../assets/images/defaultuser.png';
import { utils, writeFileXLSX } from 'xlsx';
import CircularProgress from '@mui/material/CircularProgress';
import { Box} from '@mui/material';
import config from 'config';
// import { axiosInstance } from './Api';
export const libraries = ['places'];

export const defaultUserIMG = Profile;

export const apiBaseURL = () => {
  const hostname = window.location.hostname;

  if (hostname == 'dronmatchmaker.itworkshop.in') {
    return 'https://dronmatchmaker.itworkshop.in';
  } else {
    return 'https://dronefreelancer.com.au';
  }
  // if (hostname === "localhost" || hostname === "127.0.0.1") {
  //   // return "https://dronmatchmaker.itworkshop.in";
  //   return "http://170.64.131.134";
  //   // return "http://localhost:5000";
  // } else if (hostname == 'dronmatchmaker.itworkshop.in') {
  //   return "https://dronmatchmaker.itworkshop.in";
  // } else if (hostname == '170.64.131.134') {
  //   return "http://170.64.131.134";
  // } else if (hostname === 'dronefreelancer.com.au') {
  //   return "http://dronefreelancer.com.au"
  // } else if (hostname === 'www.dronefreelancer.com.au') {
  //   return "http://dronefreelancer.com.au"
  // }
};



export const toastifySuccess = (message) => {
  toast.success(`${message}`, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
  });
};

export const toastifyError = (message) => {
  toast.error(`${message}`, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
  });
};

export const encryptLocalStorageData = (name, data, key) => {
  var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  localStorage.setItem(name, encryptData);
};

export const dycryptLocalStorageData = (encryptData, key) => {
  var bytes = CryptoJS.AES.decrypt(encryptData, key);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const getAllLocatData = () => {
  if (localStorage.getItem('web-secret')) return dycryptLocalStorageData(localStorage.getItem('web-secret'), 'DoNotTryToAccess');
  else {
    return null;
  }
};

export const getCurrentDate = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

export const getMaxDate = (inMonth) => {
  const today = new Date();
  today.setMonth(today.getMonth() + inMonth);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

export const handleDownloadExcel = (dataSource: any, sheetName: string, fileName: string) => {
  const ws = utils.json_to_sheet(dataSource);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  writeFileXLSX(wb, `${fileName}.xlsx`);
  // writeFileXLSX(wb, `${fileName}.pdf`);
};

export const AdminLoading = () => {
  return (
    <>
      <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Box>
          <CircularProgress size={60} />
        </Box>
      </div>
    </>
  )
}

export const LoadingBTN = () => {
  return (
    <>
      <button className="global_btn">
        <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
      </button>
    </>
  );
};

export const LoadingDashBTN = () => {
  return (
    <>
      <button className="global_dashbtn">
        <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
      </button>
    </>
  );
};

export const generateSlug = (str) => {
  return str.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');
};

export const LOGIN_AND_GET_INFO_BY_TOKEN_FROM_IOS_AND_ANDROID_APP = async (key) => {
  try {
    sessionStorage.clear()
    const res = await fetch(`${config.url}/user/getUserdatas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }
    });
    const resultdata = await res.json();
    if (resultdata.status == 200) {
      const userInfo = resultdata?.getUserdata;
      localStorage.setItem('login_id', userInfo._id);
      localStorage.setItem('jwt', key);
      localStorage.setItem('user_type', userInfo.role);
      localStorage.setItem('loginname', userInfo?.first_name);
      localStorage.setItem('loginstatus', '1');
      localStorage.setItem('img', userInfo?.image);
      const dataParam = {
        login_id: userInfo._id,
        jwt: key,
        user_type: userInfo.role,
        loginname: userInfo.first_name,
        loginstatus: '1',
        img: userInfo?.image,
        subcription_id: userInfo?.subcription_id,
        subcription_type: userInfo?.subscription_type
      };
      encryptLocalStorageData('web-secret', dataParam, 'DoNotTryToAccess');
      sessionStorage.setItem("hasCalledApi", "true");
      window.location.reload()
    }
  } catch (error) {
    console.log(error);
  }
};

export const  closeWindow = () => {
  window.open('', '_self');
  window.close();
}
