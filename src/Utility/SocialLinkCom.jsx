import React from 'react'
import { Link } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
const SocialLinkCom = ({ label, url }) => {
    const formattedUrl = url?.startsWith('http://') || url?.startsWith('https://') ? url : `https://${url}`;
    return (
        url && (
          <p className="no_data">
            <strong>{label} :</strong> <Link to={formattedUrl} target='_blank' rel="noopener noreferrer"><LinkIcon /></Link>
          </p>
        )
      );
}

export default SocialLinkCom