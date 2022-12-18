import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apiCalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
        console.log(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className="bg-stone-50 flex justify-center items-center h-screen w-screen ">
      <div className="card  p-2  ">
        <div className="flex flex-col p-7 border shadow-xl border-black-900">
          <div className="flex">
            <h1 className="text-2xl font-bold ">Register</h1>
          </div>
          <hr />
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="name" label="Name">
              <input type="text" className="p-1 border border-gray-900" />
            </Form.Item>
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
                Register
              </button>
              <Link to="/login" className="underline">
                Already Signed Up ? Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
