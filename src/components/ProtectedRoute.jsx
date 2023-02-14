import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apiCalls/users.js";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { BiHomeAlt } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout, AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiNewspaper } from "react-icons/gi";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/"],
      icon: (
        <BiHomeAlt
          onClick={() => {
            navigate("/");
          }}
        />
      ),
    },

    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: (
        <HiOutlineDocumentReport
          onClick={() => {
            navigate("/user/reports");
          }}
        />
      ),
    },
    {
      title: "Profile",
      paths: ["/profile"],
      icon: (
        <CgProfile
          onClick={() => {
            navigate("/profile");
          }}
        />
      ),
    },

    {
      title: "Logout",
      paths: ["/logout"],
      icon: (
        <AiOutlineLogout
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        />
      ),
    },
  ];
  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: (
        <BiHomeAlt
          onClick={() => {
            navigate("/");
          }}
        />
      ),
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: (
        <GiNewspaper
          onClick={() => {
            navigate("/admin/exams");
          }}
        />
      ),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: (
        <HiOutlineDocumentReport
          onClick={() => {
            navigate("/admin/reports");
          }}
        />
      ),
    },
    {
      title: "Profile",
      paths: ["/profile"],
      icon: (
        <CgProfile
          onClick={() => {
            navigate("/admin/profile");
          }}
        />
      ),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: (
        <AiOutlineLogout
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        />
      ),
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="layout">
      <div className="flex gap-2 w-full h-full h-100">
        <div className="sidebar">
          <div className="menu">
            {menu.map((item, index) => {
              return (
                <div
                  className={`menu-item ${
                    getIsActiveOrNot(item.paths) && "active-menu-item"
                  }`}
                  key={index}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="body">
          <div className="header flex justify-between">
            {!collapsed && (
              <AiOutlineClose
                className="cursor-pointer"
                onClick={() => setCollapsed(true)}
              />
            )}
            {collapsed && (
              <RxHamburgerMenu
                className="cursor-pointer"
                onClick={() => setCollapsed(false)}
              />
            )}
            <h1 className="text-2xl text-white">SHEY QUIZ</h1>
            <div>
              <div className="flex gap-1 items-center">
                <h1 className="text-md text-white">{user?.name}</h1>
              </div>
              <span>Role : {user?.isAdmin ? "Admin" : "User"}</span>
            </div>
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
