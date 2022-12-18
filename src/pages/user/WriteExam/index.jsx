import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apiCalls/exams";
import { addReport } from "../../../apiCalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";

const WriteExam = () => {
  const [examData, setExamData] = useState(null);
  const [questions = [], setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result = {}, setResult] = useState({});
  const [view, setView] = useState("Instructions");

  // Timer States
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const params = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  // GET EXAM DATA BY ID FUNCTION
  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({ examId: params.id });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // CALCULATE RESULT FUNCTION
  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        // question.correctOption from exam modal
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };

      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;

    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
        // calculateResult();
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>

        {/* INSTRUCTION VIEW */}
        {view === "Instructions" && (
          <Instructions
            examData={examData}
            view={view}
            setView={setView}
            startTimer={startTimer}
          />
        )}
        {/* INSTRUCTION VIEW */}

        {/* QUESTION VIEW */}
        {view === "questions" && (
          <div className="flex flex-col gap-2">
            {/* Timer , Question no and Question */}
            <div className="flex justify-between">
              <h1 className="text-2xl">{`${selectedQuestionIndex + 1} : ${
                questions[selectedQuestionIndex].name
              } `}</h1>

              <div className="timer">
                <span className="text-2xl">{secondsLeft}</span>
              </div>
            </div>

            {/* Question Options */}
            <div className="flex flex-col gap-2">
              {/* Object.keys as options is an object */}
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                      className={`cursor-pointer hover:bg-slate-100 transition-all ease-in ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                    >
                      <h1 className="text-xl flex gap-1 ">
                        <span> {option}:</span>
                        <span>
                          {questions[selectedQuestionIndex].options[option]}
                        </span>
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            {/* Prev , Next and submit button  */}
            <div className="flex justify-between ">
              {selectedQuestionIndex > 0 && (
                <button
                  onClick={() =>
                    setSelectedQuestionIndex(selectedQuestionIndex - 1)
                  }
                  className="p-2 text-semibold border border-b-black flex justify-center items-center hover:bg-zinc-100"
                >
                  Prev
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  onClick={() =>
                    setSelectedQuestionIndex(selectedQuestionIndex + 1)
                  }
                  className="p-2 text-semibold border border-b-black flex justify-center items-center hover:bg-zinc-100"
                >
                  Next
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="p-2 text-bold flex justify-center items-center hover:bg-green-300 bg-green-200"
                  onClick={() => {
                    // first calculate result
                    // and then navigate / render
                    // result page

                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                  type="submit"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
        {/* QUESTION VIEW */}

        {/* RESULT VIEW */}
        {view === "result" && (
          <div className="flex justify-center items-center mt-2 ">
            <div className="flex flex-col gap-2 result">
              <h1 className="text-2xl">RESULT</h1>

              <div className="marks">
                <h1 className="text-md">Total Marks: {examData.totalMarks}</h1>
                <h1 className="text-md">
                  Obtained Marks: {result.correctAnswers.length}
                </h1>
                <h1 className="text-md">
                  Wrong Answers: {result.wrongAnswers.length}
                </h1>
                <h1 className="text-md">
                  Passing Marks: {examData.passingMarks}
                </h1>
                <h1 className="text-md">Verdict: {result.verdict} </h1>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setView("review");
                    }}
                    className="p-2 text-md border border-b-black flex justify-center items-center hover:bg-zinc-100"
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            </div>

            {/* Lottie Animation */}
            <div className="lottie-animation">
              {result.verdict === "Pass" ? (
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_zwkm4xbs.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              ) : (
                <lottie-player
                  src="https://assets10.lottiefiles.com/packages/lf20_reg7q42p.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              )}
            </div>
          </div>
        )}
        {/* RESULT VIEW */}

        {/* REVIEW VIEW */}
        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  key={index}
                  className={`
                  flex flex-col gap-1 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }
                `}
                >
                  <h1 className="text-xl">
                    {index + 1} : {question.name}
                  </h1>
                  <h1 className="text-md">
                    Submitted Answer : {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Correct Answer : {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="primary-outlined-btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* REVIEW VIEW */}
      </div>
    )
  );
};

export default WriteExam;
