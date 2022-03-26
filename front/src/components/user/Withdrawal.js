import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import swal from "sweetalert";

import * as Api from "../../api";
import { DispatchContext } from "../../App";
import { UserStateContext } from "../../App";
// import confirmModal from "./ConfirmWithdrawal";
import "../../styles/scss/Withdrawal.scss";

function Withdrawal() {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

  const userState = useContext(UserStateContext);

  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState("");
  //useState로 password 상태를 생성함.
  const [password, setPassword] = useState("");

  //이메일이 abc@example.com 형태인지 regex를 이용해 확인함.
  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  //위 validateEmail 함수를 통해 이메일 형태 적합 여부를 확인함.
  const isEmailValid = validateEmail(email);
  // 비밀번호가 4글자 이상인지 여부를 확인함.
  const isPasswordValid = password.length >= 4;
  // 비밀번호와 확인용 비밀번호가 일치하는지 여부를 확인함.
  // 이메일과 비밀번호 조건이 동시에 만족되는지 확인함.
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this account!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          Api.post(`withdrawal/${userState.user.id}`, {
            email,
            password,
          });
          swal("Your account has been deleted!", "Thank you for using Dfolio", {
            icon: "success",
          });
          dispatch({ type: "LOGOUT" });
          navigate("/login");
          sessionStorage.removeItem("userToken");
        } else {
          swal("Your membership cancellation request has been cancelled.");
          navigate("/");
        }
      });
    } catch (err) {
      window.alert("회원탈퇴에 실패했습니다! 이메일 또는 아이디를 확인하세요.");
    }

    /*
    try {
      const check = confirmModal();
      // "user/register" 엔드포인트로 post요청함.//////////////////////////////////
      if (check === 1) {
        await Api.post(`withdrawal/${userState.user.id}`, {
          email,
          password,
        });
        window.alert("그동안 Dfolio를 이용해 주셔서 감사합니다.");
        dispatch({ type: "LOGOUT" });
        navigate("/login");
        sessionStorage.removeItem("userToken");
      } else if (check === 0) {
        window.alert("회원탈퇴를 취소하셨습니다.");
        navigate("/");
      }
    } catch (err) {
      window.alert("회원탈퇴에 실패했습니다! 이메일 또는 아이디를 확인하세요.");
    }
    */
  };

  return (
    <div className="withdrawal-container">
      <div className="withdrawal-left-container">
        <div className="withdrawal-left-wrap">
          <h1>Dfolio</h1>
          <p>Discover the world’s top developers</p>
        </div>
      </div>
      <div className="withdrawal-right-container">
        <div id="withdrawal-right-logo">Dfolio</div>
        <div id="withdrawal-text">
          <h5>Are you sure leave the Difolio?</h5>
          <p>
            Enter the email address you used when you joined.
            <br />
          </p>
        </div>
        <div className="withdrawal-input-container" onSubmit={handleSubmit}>
          <div>
            <div id="withdrawal-eamil-container">
              <Form.Control
                className="withdrawal-input-wrap input-id"
                id="withdrawal-input-id"
                placeholder="Email"
                type="email"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!isEmailValid && (
                <p
                  className="text-primary"
                  style={{ fontSize: "12px", margin: "5px 0 0 0" }}
                >
                  Email is invalid.
                </p>
              )}
            </div>
          </div>
          <div>
            <div id="withdrawal-password-container">
              <Form.Control
                className="withdrawal-input-wrap input-password"
                id="withdrawal-input-password"
                placeholder="Password"
                type="password"
                autoComplete="on"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isPasswordValid && (
                <p
                  className="text-primary"
                  style={{ fontSize: "12px", margin: "5px 0 0 0" }}
                >
                  Password is too short (minimum is 4 characters)
                </p>
              )}
            </div>
          </div>
          <form className="withdrawal-btn-wrap">
            <button className="withdrawal-btn-back" type="submit" onClick={() => navigate("/")}>
              Back
            </button>
            <button className="withdrawal-btn-delete" type="submit" disabled={!isFormValid}>
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Withdrawal;