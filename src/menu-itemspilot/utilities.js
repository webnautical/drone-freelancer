import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  MessageOutlined,
  FontSizeOutlined,
  FileSearchOutlined,
  LoadingOutlined,
  ProfileOutlined,
  FileProtectOutlined,
  ShopOutlined,
  WalletOutlined,
 
} from '@ant-design/icons';
import AddCardIcon from '@mui/icons-material/AddCard';
// import DescriptionIcon from '@mui/icons-material/Description';
// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  FileSearchOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  MessageOutlined,
  ProfileOutlined,
  FileProtectOutlined,
  ShopOutlined,
  WalletOutlined,
};
 
import config from 'config';
// ==============================|| MENU ITEMS - UTILITIES ||============================== //
 
const PilotTab = {
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
      id: 'util-color',
      title: 'Profile ',
      type: 'item',
      url: `${config.basenameuser}/profileedit`,
      icon: icons.ProfileOutlined
    },
    {
      id: 'util-shadow',
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
      id: 'Plans',
      title: 'Plans',
      type: 'item',
      url: `${config.basenameuser}/plans`,
      icon: icons.  WalletOutlined
    },
    {
      id: 'Transaction',
      title: 'Transaction',
      type: 'item',
      url: `${config.basenameuser}/transaction`,
      icon: icons.  WalletOutlined
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
 
export default PilotTab;
 
export const GuestTab = {
  id: 'utilities',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: `${config.basenameuser}/dashboard/default`,
      icon: icons.BgColorsOutlined
    },
    {
      id: 'util-typography',
      title: 'Chats',
      type: 'item',
      url: `${config.basenameuser}/chats`,
      icon: icons.FontSizeOutlined
    },
  ]
};