import React from "react";
import { Link } from "react-router-dom";
import { Grid, Box} from "@mui/material";
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

import Logo from "../assets/logo.jpg";
import Banner from "../assets/banner.jpg";
import Teacher1 from "../assets/teacher/giao-vien-01.png";
import Teacher2 from "../assets/teacher/giao-vien-02.png";
import Teacher3 from "../assets/teacher/giao-vien-03.png";
import Teacher4 from "../assets/teacher/giao-vien-04.png";
import Teacher5 from "../assets/teacher/giao-vien-05.png";

import Background1 from "../assets/background1.webp";
import {
  LightOrangeButton,
  LightWhiteButton,
} from "../components/buttonStyles";

const TeacherList = [
  {
    tenGV: "Vũ Xuân Quỳnh",
    anh: Teacher1,
    hocVi: "Thạc sĩ",
    moTa: "Thủ khoa đầu vào khoa Toán ĐH Khoa Học Tự Nhiên. Giáo viên Toán THPT Anhxtanh HN. Nghiên cứu viên Viện Hàn Lâm Khoa Học Công Nghệ VN.",
  },

  {
    tenGV: "Trần Thị Cúc",
    anh: Teacher2,
    hocVi: "Thạc sĩ",
    moTa: "Tốt nghiệp khoa Sư phạm Hóa Học – ĐH Sư Phạm Hà Nội. Giảng dạy tại THPT Giao Thủy B – Nam Định (3 năm)",
  },

  {
    tenGV: "Nguyễn Thị Hằng",
    anh: Teacher3,
    hocVi: "Thạc sĩ",
    moTa: "Tốt nghiệp bằng giỏi khoa Sư Phạm Hóa – ĐH Sư Phạm Hà Nội. Giải ba Olimpic Hóa học sinh viên toàn quốc lần thứ X/2018. Giáo viên THPT Phạm Ngũ Lão, Đông Anh, HN",
  },

  {
    tenGV: "Phạm Quang Khiêm",
    anh: Teacher4,
    hocVi: "Thạc sĩ",
    moTa: "Chuyên Lý Trường THPT Chuyên Lương Văn Tuỵ. Tốt Nghiệp Khoa Vật Lý – Đại Học Sư Phạm Hà Nội. Thạc Sĩ về lý luận và phương pháp dạy học Vật Lý- ĐH Sư Phạm Hà Nội",
  },

  {
    tenGV: "Trần Thị Trang",
    anh: Teacher5,
    hocVi: "Cử nhân",
    moTa: "Tốt nghiệp ngành Ngôn Ngữ Anh – ĐH Thương Mại HN. Giáo viên Tiếng Anh, THCS VinSchool – Hà Nội",
  },
];

const Homepage = () => {
  return (
    <>
      <StyledContainer>
        <StyledComponentLeftAligned>
          <StyledContainer>
            <StyledBackground color={"white"} />
            <Grid
              container
              spacing={0}
              direction="row"
              justifyContent="space-between"
            >
              <Grid item md={12} lg={6}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <img
                    src={Logo}
                    alt="logo"
                    style={{
                      width: "50px",
                      height: "50px",
                      padding: "5px 5px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        color: "#f68620",
                        fontSize: "1.5rem",
                        fontWeight: "600",
                      }}
                    >
                      TRUNG TÂM HC EDUCATION
                    </p>
                    <p
                      style={{
                        color: "#58585a",
                        fontSize: "1rem",
                        fontWeight: "600",
                      }}
                    >
                      Luyện thi tận tâm - Nâng tầm tri thức
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid
                item
                md={12}
                lg={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0,5rem",
                    }}
                  >
                    <Tooltip
                      title={
                        <p>
                          CS1: A36 TT10 KĐT Văn Quán, Phường Văn Quán, Hà Đông,
                          Hà Nội <br />
                          CS2: Tòa HH02.2A - KĐT Thanh Hà - Q.Hà Đông
                        </p>
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <AddLocationAltIcon fontSize="large" />
                      Địa chỉ
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "5px",
                    }}
                    className="center-tooltip"
                  >
                    <Tooltip
                      title={<h3>08:00 - 21:45</h3>}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <AccessTimeIcon fontSize="large" />
                      Thời gian làm việc
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                    }}
                  >
                    <Tooltip
                      title={<p>0988.174.888 - 0706.123.888 – 0703.123.888</p>}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <PhoneIcon fontSize="large" />
                      Đường dây nóng
                    </Tooltip>
                  </div>
                </div>
              </Grid>
            </Grid>
          </StyledContainer>
        </StyledComponentLeftAligned>
      </StyledContainer>
      <StyledContainer>
        <StyledComponent>
          <StyledBackground color={"white"} />
          <Grid
            container
            spacing={0}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={6}>
              <img
                src={Banner}
                alt="banner"
                style={{
                  width: "90%",
                  paddingTop: "-5px",
                  borderRadius: "10px",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledPaper elevation={3}>
                <StyledTitle>
                  Tóm lược về
                  <br />
                  HC Education
                </StyledTitle>
                <StyledText>
                  HCE là một trung tâm uy tín, chất lượng hàng đầu với các sứ
                  mệnh, mục tiêu:
                  <br />
                  - Chuyên luyện thi chuyển cấp – ôn thi Đại Học
                  <br />
                  - Bồi dưỡng các môn Toán – Văn – Anh – Lí – Hóa – Sinh từ lớp
                  1 đến lớp 12
                  <br />
                  <i style={{ color: "#5678ff" }}>
                    "Trung tâm HC Education luôn hướng đến chất lượng giảng dạy
                    tốt nhất và đem lại thật nhiều giá trị cho các em học sinh."
                  </i>
                </StyledText>
                <StyledBox>
                  <StyledLink to="https://zalo.me/0988174888">
                    <LightWhiteButton
                      variant="contained"
                      // fullWidth
                      style={{ margin: "5px" }}
                    >
                      Đăng ký học ngay
                    </LightWhiteButton>
                  </StyledLink>
                  <StyledLink to="/choose">
                    <LightOrangeButton
                      variant="contained"
                      // fullWidth
                      style={{ margin: "5px" }}
                    >
                      Đăng nhập
                    </LightOrangeButton>
                  </StyledLink>
                </StyledBox>
              </StyledPaper>
            </Grid>
          </Grid>
        </StyledComponent>
      </StyledContainer>
      <StyledContainer>
        <StyledComponent>
          <StyledBackground color={"rgb(255 144 44)"} />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <StyledTextTitle style={{ color: "#58585a" }}>
                Lý do nên chọn
              </StyledTextTitle>
            </Grid>
            <Grid item xs={12}>
              <StyledTextTitle
                style={{ color: "#ffffff", marginBottom: "1rem" }}
              >
                HC Education
              </StyledTextTitle>
            </Grid>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              marginBottom="2rem"
            >
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContainer style={{ background: "rgb(255,255,255,0.9)" }}>
                    <CardTitle>Phương pháp hướng dẫn học sinh tự học</CardTitle>
                    <CardContent>
                      Học sinh được quan tâm, kiểm tra thường xuyên và trợ giúp
                      khi cần.
                      <br />
                      Ngoài được học kiến thức, học sinh còn được rèn luyện: kỹ
                      năng sống, thái độ học tập, nề nếp kỉ luật và định hướng
                      nghề nghiệp.
                    </CardContent>
                  </CardContainer>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContainer style={{ background: "rgb(255,255,255,0.9)" }}>
                    <CardTitle>Đội ngũ giáo viên giỏi và tâm huyết</CardTitle>
                    <CardContent>
                      Học sinh được học với các giáo viên giỏi, nhiệt tình,
                      nhiều năm kinh nghiệm.
                      <br />
                      Luôn khích lệ tinh thần học tập của các em bằng các phần
                      thưởng khi có kết quả tốt.
                      <br />
                      Những học sinh có hoàn cảnh khó khăn hoặc ở xa được Trung
                      tâm hỗ trợ giảm học phí.
                    </CardContent>
                  </CardContainer>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContainer style={{ background: "rgb(255,255,255,0.9)" }}>
                    <CardTitle>Phân lớp theo năng lực học sinh</CardTitle>
                    <CardContent>
                      Các lớp học được chia nhỏ (5-15 học sinh) để đảm bảo chất
                      lượng giảng dạy.
                      <br />
                      Ngoài các buổi học chính, học sinh còn được học phụ đạo
                      miễn phí.
                    </CardContent>
                  </CardContainer>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContainer style={{ background: "rgb(255,255,255,0.9)" }}>
                    <CardTitle>Tổ chức kiểm tra và đánh giá định kỳ</CardTitle>
                    <CardContent>
                      Điểm danh học sinh mỗi buổi học, báo cáo tình hình học tập
                      hàng tháng cho phụ huynh.
                    </CardContent>
                  </CardContainer>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContainer style={{ background: "rgb(255,255,255,0.9)" }}>
                    <CardTitle>
                      Cung cấp giáo trình và tài liệu tiêu chuẩn
                    </CardTitle>
                    <CardContent>
                      Chương trình, tài liệu đáp ứng đầy đủ các tiêu chí của Bộ
                      Giáo dục tạo và cập nhật các tiêu chuẩn giáo dục của thế
                      giới.
                    </CardContent>
                  </CardContainer>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContainer style={{ background: "rgb(255,255,255,0.9)" }}>
                    <CardTitle>Cam kết về chất lượng dạy và học</CardTitle>
                    <CardContent>
                      Học sinh được cam kết mục tiêu đầu ra theo từng khóa học
                      như: Sự tiến bộ ý thức, thái độ, điểm thi học kỳ, điểm thi
                      vào lớp 10, điểm thi Đại học.
                    </CardContent>
                  </CardContainer>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </StyledComponent>
      </StyledContainer>
      <StyledContainer>
        <StyledComponent>
          <StyledBackground image={Background1} />
          <Grid item xs={12}>
            <StyledTextTitle style={{ color: "#58585a", textAlign: "center" }}>
              Đội Ngũ Giáo Viên{" "}
              <span style={{ color: "rgb(246, 134, 32)" }}>Ưu Tú</span>
            </StyledTextTitle>
          </Grid>
          {/* <Grid item xs={12}>
            <p
              style={{
                color: "#58585a",
                marginBottom: "1rem",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Giỏi chuyên môn - Giàu kinh nghiệm - Phương pháp dễ hiểu
            </p>
          </Grid> */}
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            marginBottom="2rem"
          >
            {TeacherList.map((item, index) => {
              return (
                <Grid item xs={12} md={4} key={index}>
                  <TeacherCard>
                    <img
                      src={item.anh}
                      alt={item.tenGV}
                      style={{ borderRadius: "10px" }}
                    />
                    <h3 style={{ color: "rgb(246, 134, 32)" }}>{item.hocVi}</h3>
                    <h2>{item.tenGV}</h2>
                    <p>{item.moTa}</p>
                  </TeacherCard>
                </Grid>
              );
            })}
          </Grid>
          <StyledBox>
            <StyledLink to="https://hc.edu.vn">
              <LightWhiteButton
                variant="outlined"
                // fullWidth
                style={{ margin: "5px" }}
              >
                Tìm hiểu thêm về HCE
              </LightWhiteButton>
            </StyledLink>
          </StyledBox>
        </StyledComponent>
      </StyledContainer>
      <StyledContainer>
        <StyledComponent>
          <StyledBackground color="black" />
          <Grid item xs={12}>
            <p
              style={{
                color: "white",
                margin: "1rem 0",
                fontSize: "1rem",
                fontWeight: "600",
                textAlign: "center",
                fontFamily: "sans-serif !important",
              }}
            >
              Bản quyền 2024 © thuộc về HC Education | ĐATN - 20200515
            </p>
          </Grid>
        </StyledComponent>
      </StyledContainer>
    </>
  );
};

export default Homepage;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  overflow: hidden;

  .center-tooltip {
    margin: 0 0.5rem;
    ore,
    er {
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      content: "";
      height: 1rem;
      width: 1px;
    }
  }
`;

const StyledBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: cover;
  background-color: ${(props) => props.color};
  z-index: -1;
`;

const StyledComponent = styled.div`
  width: 60%;

  @media (max-width: 768px) {
    width: 100vh;
  }
`;

const StyledComponentLeftAligned = styled(StyledComponent)`
  justify-content: start;
`;

const StyledPaper = styled.div`
  padding: 1.5rem;
  height: fit-content;
  font-family: "Poppins", sans-serif !important;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 5px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 30px;
  letter-spacing: normal;
  line-height: normal;
  text-align: justify;
`;

const StyledTextTitle = styled(StyledText)`
  font-family: sans-serif !important;
  font-size: 2.5rem;
  margin: 1.5rem 0 0;
  font-weight: 600;

  span {
    font-family: sans-serif !important;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Card = styled.div`
  cursor: pointer;
  height: 100%;
`;

const CardContainer = styled.div`
  border-radius: 10px;
  height: 100%;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.22);
  }
`;

const CardTitle = styled.h2`
  font-family: sans-serif !important;
  padding: 1.5rem;
  padding-bottom: 0;
  text-align: left;

  color: #f68620;
`;

const CardContent = styled.p`
  font-family: sans-serif !important;
  text-align: justify;
  line-height: 2rem;
  color: black;
  padding: 1.5rem;
  font-size: 1.25rem;
`;

const TeacherCard = styled.div`
  border-radius: 10px;
  padding: 1.5rem;
  text-align: justify;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;

  img {
    width: 100%;
  }

  h2,
  h3 {
    text-align: center;
    font-family: sans-serif !important;
  }

  p {
    font-size: 1.25rem;
  }
`;
