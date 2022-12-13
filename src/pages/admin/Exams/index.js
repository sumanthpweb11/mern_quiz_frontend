import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import PageTitle from "../../../components/PageTitle";
import { GrAddCircle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { deleteExamById, getAllExams } from "../../../apiCalls/exams";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <AiOutlineEdit
            className="cursor-pointer"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          />

          <AiOutlineDelete onClick={() => deleteExam(record._id)} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getExamsData();
  }, []);

  return (
    <div>
      <div className="flex justify-between mt-2">
        <PageTitle title="Exams" />
        <button
          onClick={() => navigate("/admin/exams/add")}
          className="outlined flex justify-between items-center gap-1 bg-slate-400 "
        >
          Add Exam
          <GrAddCircle />
        </button>
      </div>
      <hr className="mt-1" />

      {/* TABLE */}
      <Table columns={columns} dataSource={exams} />
    </div>
  );
};

export default Exams;
