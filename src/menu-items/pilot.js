// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    FileSearchOutlined,
    LoadingOutlined
  } from '@ant-design/icons';
  
  // icons
  const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    FileSearchOutlined,
    LoadingOutlined,
    AppstoreAddOutlined
  };
  // ==============================|| MENU ITEMS - pilot ||============================== //
  
  const pilot = {
    id: 'pilot',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/',
        icon: icons.BgColorsOutlined
      },
      {
        id: 'util-typography',
        title: 'Chats',
        type: 'item',
        url: '/chats',
        icon: icons.FontSizeOutlined
      },
      {
        id: 'util-color',
        title: 'Profile ',
        type: 'item',
        url: '/profileedit',
        icon: icons.BgColorsOutlined
      },
      {
        id: 'util-shadow',
        title: 'Jobs',
        type: 'item',
        url: '/jobs',
        icon: icons.FileSearchOutlined
      },
      {
        id: 'Plans',
        title: 'Plans',
        type: 'item',
        url: '/plans',
        icon: icons.FileSearchOutlined
      }
    ]
  };
  
  export default pilot;
  