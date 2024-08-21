import React from "react";
import { Col,  Row } from "react-bootstrap";
// import Whitedrone from "../../assets/images/whitedrone.png";
import Blogthumb from "../../assets/images/blogimg.png";
import Breacrumb from "staticspage/Header/Breacrumb";
const Blogs = () => {
  return (
    <div className="blogs_page">
              <Breacrumb />

      <section className="blogs_box">
        <div className="container">
          <Row>
            <Col md="4">
              <div class="news-wrapper-style1 mrb-30">
                <div class="news-thumb">
                  <img
                    src={Blogthumb}
                    alt="logo"
                    style={{ maxWidth: "", maxHeight: "" }}
                    className="grey_img"
                  />
                </div>
                <div class="news-description">
                  <h4 class="the-title mb-2">
                    <a href="https://adviteya.com/blog/seo-the-ultimate-guide/">
                      SEO in 2023: The Ultimate Guide
                    </a>
                  </h4>

                  <p>
                    SEO refers to a set of technics through which Google values
                    your content over others. SEO is a crucial aspect […]
                  </p>
                </div>
              </div>
            </Col>

            <Col md="4">
              <div class="news-wrapper-style1 mrb-30">
                <div class="news-thumb">
                  <img
                    src={Blogthumb}
                    alt="logo"
                    style={{ maxWidth: "", maxHeight: "" }}
                    className="grey_img"
                  />
                </div>
                <div class="news-description">
                  <h4 class="the-title mb-2">
                    <a href="https://adviteya.com/blog/seo-the-ultimate-guide/">
                      SEO in 2023: The Ultimate Guide
                    </a>
                  </h4>

                  <p>
                    SEO refers to a set of technics through which Google values
                    your content over others. SEO is a crucial aspect […]
                  </p>
                </div>
              </div>
            </Col>

            <Col md="4">
              <div class="news-wrapper-style1 mrb-30">
                <div class="news-thumb">
                  <img
                    src={Blogthumb}
                    alt="logo"
                    style={{ maxWidth: "", maxHeight: "" }}
                    className="grey_img"
                  />
                </div>
                <div class="news-description">
                  <h4 class="the-title mb-2">
                    <a href="https://adviteya.com/blog/seo-the-ultimate-guide/">
                      SEO in 2023: The Ultimate Guide
                    </a>
                  </h4>

                  <p>
                    SEO refers to a set of technics through which Google values
                    your content over others. SEO is a crucial aspect […]
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
