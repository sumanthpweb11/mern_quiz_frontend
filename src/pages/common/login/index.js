import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../apiCalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading);
      const response = await loginUser(values);
      dispatch(HideLoading);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        message.error(response.message);
        navigate("/register");
      }
    } catch (error) {
      dispatch(HideLoading);
      message.error(error.message);
    }
  };

  return (
    <div className="bg-stone-50 flex justify-center items-center h-screen w-screen bg-primary">
      <div className="card  p-2  ">
        <div className="flex flex-col p-7 border shadow-xl border-black-900">
          <div className="flex">
            <h1 className="text-2xl font-bold ">LOGIN</h1>
          </div>
          <hr />
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="email" label="Email">
              <input type="text" className="p-1 border border-gray-900" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <input type="password" className=" p-1 border border-gray-900" />
            </Form.Item>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="bg-yellow-100 p-2 hover:bg-yellow-200 mt-2 w-100"
              >
                Login
              </button>
              <Link to="/register" className="underline">
                Not a member? Register
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
