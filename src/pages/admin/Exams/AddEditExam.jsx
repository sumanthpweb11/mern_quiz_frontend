import { Col, Form, message, Row, Tabs } from "antd";
// import FormItem from "antd/es/form/FormItem";
import React from "react";
import {
  addExam,
  editExamById,
  getAllExams,
  getExamById,
} from "../../../apiCalls/exams";
import PageTitle from "../../../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { useState } from "react";
import { useEffect } from "react";
import AddEditQuestion from "./AddEditQuestion";
const { TabPane } = Tabs;

const AddEditExam = () => {
  const [examData, setExamData] = useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({ examId: params.id });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onFinish = async (values) => {
    // console.log("values of form", values);

    try {
      dispatch(ShowLoading);
      let response;

      if (params.id) {
        response = await editExamById({
          ...values,
          examId: params.id,
        });
      } else {
        response = await addExam(values);
      }

      dispatch(HideLoading);
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      }
    } catch (error) {
      dispatch(HideLoading);
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  return (
    <div>
      <PageTitle title={params.id ? "Edit Exam" : "Add Exam"} />
      <hr className="mt-1" />

      {(examData || !params.id) && (
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={examData}
          className="mt-1"
        >
          {/* TABS */}

          <Tabs defaultActiveKey="1">
            {/* TAB PANE 1 */}
            <TabPane tab="Exam-Details" key="1">
              {/* ROW 1  */}
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Form.Item label="Exam Name" name="name">
                    <input type="text" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Exam Duration" name="duration">
                    <input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              {/* ROW 2  */}

              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Form.Item label="Category" name="category">
                    <select name="" id="">
                      <option value="javascript">Javascript</option>
                      <option value="react">React</option>
                      <option value="node">Node</option>
                      <option value="mongodb">MongoDb</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Total Marks" name="totalMarks">
                    <input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              {/* ROW 3  */}
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Form.Item label="Passing Marks" name="passingMarks">
                    <input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              {/*  Buttons */}
              <Row gutter={[10, 10]}>
                <Col
                  span={24}
                  className="flex gap-3 justify-center items-center"
                >
                  <button
                    className="w-[45%] flex justify-center items-center mt-2 bg-yellow-100 hover:bg-yellow-200"
                    type="button"
                    onClick={() => navigate("/admin/exams")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-[45%] flex justify-center items-center mt-2 bg-green-100 hover:bg-green-200"
                  >
                    Save
                  </button>
                </Col>
              </Row>
            </TabPane>

            {/* TAB PANE 2 */}
            {/* QUestions tab shd not be visible n add questions tab */}
            {params.id && (
              <TabPane tab="Questions" key="2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddEditQuestionModal(true)}
                    className="w-[15%] flex justify-center items-center mt-2 bg-green-100 hover:bg-green-200"
                  >
                    Add Question
                  </button>
                </div>
              </TabPane>
            )}
          </Tabs>

          {/* TABS */}
        </Form>
      )}

      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
        />
      )}
    </div>
  );
};

export default AddEditExam;
