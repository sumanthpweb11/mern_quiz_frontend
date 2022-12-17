import { Form, message, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apiCalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

const AddEditQuestion = ({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setSelectedQuestion,
}) => {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    // console.log("modal values", values);

    try {
      dispatch(ShowLoading);
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },

        exam: examId,
      };

      let response;

      if (selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id,
        });
      } else {
        response = await addQuestionToExam(requiredPayload);
      }

      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null);
      dispatch(HideLoading);
    } catch (error) {
      dispatch(HideLoading);
      message.error(error.message);
    }
  };

  return (
    <Modal
      footer={false}
      title={selectedQuestion ? "Edit Question" : "Add Question"}
      open={showAddEditQuestionModal}
      onCancel={() => {
        setShowAddEditQuestionModal(false);
        setSelectedQuestion(null);
      }}
    >
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: selectedQuestion?.name,
          A: selectedQuestion?.options?.A,
          B: selectedQuestion?.options?.B,
          C: selectedQuestion?.options?.C,
          D: selectedQuestion?.options?.D,
          correctOption: selectedQuestion?.correctOption,
        }}
      >
        <Form.Item name="name" label="Question">
          <input type="text" />
        </Form.Item>

        <Form.Item name="correctOption" label="Correct Option">
          <input type="text" />
        </Form.Item>

        <div className="flex gap-1">
          <Form.Item name="A" label="Option A">
            <input type="text" />
          </Form.Item>

          <Form.Item name="B" label="Option B">
            <input type="text" />
          </Form.Item>
        </div>

        <div className="flex gap-1">
          <Form.Item name="C" label="Option C">
            <input type="text" />
          </Form.Item>

          <Form.Item name="D" label="Option D">
            <input type="text" />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-1">
          <button
            onClick={() => setShowAddEditQuestionModal(false)}
            type="button"
            className="w-[15%] flex justify-center items-center mt-2 bg-yellow-100 hover:bg-yellow-200"
          >
            Cancel
          </button>
          <button className="w-[15%] flex justify-center items-center mt-2 bg-orange-100 hover:bg-orange-200">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditQuestion;
