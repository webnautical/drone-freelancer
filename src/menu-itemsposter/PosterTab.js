// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  MessageOutlined,
  FileSearchOutlined,
  LoadingOutlined,
  ShopOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  FileSearchOutlined,
  MessageOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  ShopOutlined
};
import StarHalfIcon from '@mui/icons-material/StarHalf';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
// import DescriptionIcon from '@mui/icons-material/Description';
import AddCardIcon from '@mui/icons-material/AddCard';

// ==============================|| MENU ITEMS - UTILITIES ||============================== //
import config from 'config';
// console.log(config.basenameuser,"sgjfgdfhdgfhsghg")
const PosterTab = {
  id: 'utilities',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: `${config.basenameuser}/dashboard/default`,
      icon: icons.AppstoreAddOutlined
    },
    {
      id: 'util-typography',
      title: 'Chats',
      type: 'item',
      url: `${config.basenameuser}/chats`,
      icon: icons.MessageOutlined
    },
    {
      id: 'postjob',
      title: 'Post A Job',
      type: 'item',
      url: `${config.basenameuser}/postjob`,
      icon: DynamicFeedIcon
    },
    {
      id: 'jobs',
      title: 'Jobs',
      type: 'item',
      url: `${config.basenameuser}/jobs`,
      icon: icons.FileSearchOutlined
    },
    {
      id: 'markeplace',
      title: 'Add Marketplace',
      type: 'item',
      url: `${config.basenameuser}/markeplace/1`,
      icon: AddCardIcon
    },

    {
      id: 'marketplacelisting',
      title: 'Marketplace List',
      type: 'item',
      url: `${config.basenameuser}/market-place-list`,
      icon: icons.ShopOutlined
    },
    {
      id: 'reviews',
      title: 'Reviews',
      type: 'item',
      url: `${config.basenameuser}/reviews`,
      icon: StarHalfIcon
    },
    {
      id: 'transaction',
      title: 'Transaction',
      type: 'item',
      url: `${config.basenameuser}/transaction`,
      icon: StarHalfIcon
    },
    // {
    //   id: 'Invoice',
    //   title: 'Invoice',
    //   type: 'item',
    //   url: `${config.basenameuser}/invoice`,
    //   icon: DescriptionIcon
    // }
  ]
};

export default PosterTab;