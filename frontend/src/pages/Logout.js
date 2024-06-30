import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../redux/userRelated/userSlice";
import styled from "styled-components";
import Logo from "../assets/logo.jpg";
import {
  LightOrangeButton,
  LightWhiteButton,
} from "../components/buttonStyles";

const Logout = () => {
  const currentUser = useSelector(state => state.user.currentUser);

  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <LogoutContainer>
      <Image src={Logo} ></Image>
      <h2>{currentUser.name}</h2>
      <hr/>
      <hr/>
      <LogoutMessage>Bạn đang muốn đăng xuất khỏi tài khoản?</LogoutMessage>
      <LightOrangeButton style={{margin: "5px"}} onClick={handleLogout}>Có, hãy rời đi</LightOrangeButton>
      <LightWhiteButton style={{margin: "5px"}} onClick={handleCancel}>
        Không, tôi muốn ở lại
      </LightWhiteButton>
    </LogoutContainer>
  );
};

export default Logout;

const LogoutContainer = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  background-color: #85769f66;
  color: black;
  height: 100%;
`;

const LogoutMessage = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
`;

const Image = styled.img`
  height: 20%;
  background: #fffff0;
  border-radius: 10px;
  padding: 5px;
  margin: 5px
`;


