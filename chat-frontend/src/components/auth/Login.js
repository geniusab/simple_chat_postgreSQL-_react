import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import loginImage from "../../assets/images/login.svg";

import AuthService from "./../../services/authService";
import {
  login,
  logout,
  selectUser,
  loginAsync,
} from "./../../features/user/userSlice";
import "./Auth.scss";

const Login = () => {
  const [email, setEmail] = useState("john.dou@gmail.com");
  const [password, setPassword] = useState("password");
  const { userInfo, loading } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("submitForm", { email, password });
    // const user = await AuthService.login({ email, password });
    // dispatch(login(user));

    await dispatch(loginAsync({ email, password }));
    navigate("/");
    // dispatch(login({ email, password }, history));
  };
  return (
    <div id="auth-container">
      {loading + ""}
      <div id="auth-card">
        <div className="card-shadow">
          <div id="image-section">
            <img src={loginImage} alt="Login" />
          </div>

          <div id="form-section">
            <h2>Welcome back</h2>

            {JSON.stringify(userInfo)}
            <form onSubmit={submitForm}>
              <div className="input-field mb-1">
                <input
                  required="required"
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className="input-field mb-2">
                <input
                  required="required"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>

              <button>LOGIN</button>
            </form>
            <button onClick={() => dispatch(logout())}>LOGOUT</button>
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
