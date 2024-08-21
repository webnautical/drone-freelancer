import React from "react";
import { Link } from 'react-router-dom';
import config from "config";


function PageNotFound() {
  return (
    <div style={{ margin: '10% 20%', display: 'flex', flexDirection: 'column', gap: '1rem', }}>
      <h3 style={{ color: "red" }}>404 Error: Page  not found</h3>
      <h4>This could be caused by the following:</h4>
      <ul>
        <li>The URL was entered incorrectly</li>
        <li>The page or document is temporarily not available</li>
        <li>The page or document was renamed and no longer exists</li>
        <li>The bookmark being used is outdated</li>
      </ul>
      <h4>Please return to <Link to={config.defaultPath}>Drone Freelancer</Link></h4>
    </div>
  );
}

export default PageNotFound;
