import React, { useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apiCalls/reports";
import { useEffect } from "react";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },

    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <div className="flex gap-2 ">
        <input
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
          type="text"
          placeholder="exam"
        />
        <input
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
          type="text"
          placeholder="user"
        />
        <button
          onClick={() => getData(filters)}
          className="p-2 text-bold flex justify-center items-center hover:bg-green-300 bg-green-200"
        >
          search
        </button>

        <button
          onClick={() => {
            setFilters({
              examName: "",
              userName: "",
            });
            getData({
              examName: "",
              userName: "",
            });
          }}
          className="p-2 text-bold flex justify-center items-center hover:bg-yellow-300 bg-yellow-200"
        >
          clear
        </button>
      </div>
      <Table columns={columns} dataSource={reportsData} className="mt-2" />
    </div>
  );
}

export default AdminReports;
