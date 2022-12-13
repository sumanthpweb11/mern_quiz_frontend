import { Modal } from "antd";
import React from "react";

const AddEditQuestion = ({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
}) => {
  return <Modal title="add question" open={showAddEditQuestionModal}></Modal>;
};

export default AddEditQuestion;
