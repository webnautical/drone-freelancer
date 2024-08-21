// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import Profileuserimg from '../assets/images/profileuserimg.png';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import { BatteryStdOutlined } from '../../../node_modules/@mui/icons-material/index';

// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //
const Chats = () => {
  //Using Inline Function and the The Logical Not (!) to toggle state
  const [isSectionActive, setIsSectionActive] = useState(false);

  const handleButtonClick = () => {
    // Toggle the isSectionActive state when the button is clicked
    setIsSectionActive(!isSectionActive);
  };
  const handleClose = () => {
    // Set isClicked to false when the close button is clicked
    setIsSectionActive(false);
  };

  return (
    <ComponentSkeleton>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ mt: 3.25 }}>
          <Typography variant="h5" className="global_top_head">
            Chats
          </Typography>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Stack spacing={3}>
          <div className='top_box'>
          <div className="chat_ui ">
              <Grid container className="outlistingouter">
                <Grid item xl="3" lg="4" md="12">
                  <div className="chat_listing">
                    <div className="serch_listing">
                      <input type="text" placeholder="Search Something" />
                    </div>
                    <div className="listings">
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                      <button className="Chatoutprofile" onClick={handleButtonClick}>
                        <div className="user_chat">
                          <div className="user_profile">
                            <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name">Poster Name</h2>
                              <p>@Project Name</p>
                            </div>
                          </div>
                          <div className="chat_date">22/22/2023</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </Grid>
                <Grid item xl="9" lg="8" md="12" className={`your-section ${isSectionActive ? 'showchatlisting' : ''}`}>
                  <div className="chat_section">
                    <div className="chat_user_header">
                      <div className="user_chat">
                        <div className="user_profile">
                          <button className="Chatoutprofile" onClick={handleClose}>
                            <ArrowBackIosNewIcon />
                          </button>
                          <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                          <div className="user_name_lastmsg">
                            <h2 className="poster_name">Poster Name</h2>
                            <p>@Project Name</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pilot chat_user_with_user">
                      <div className="left_side_chat">
                        <div className="poster_profile">
                          <img src={Profileuserimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                          <div className="name_user">Poster</div>
                        </div>
                        <div className="chat_message">
                          hello intersted in your taskLorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </div>
                      </div>
                    </div>
                    <div className="chat_user_type">
                      <input type="text" placeholder="Type Something" />
                      <button>
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
          </Stack>
        </Grid>
      </Grid>
    </ComponentSkeleton>
  );
};
export default Chats;
