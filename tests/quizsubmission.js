const axios = require("axios");
//very basic tests because NextJS is opaque and poorly documented imo so I cant actually use a TEST DB or anything.
//this is also why i am using JS.
//Don't run this unless you have my database, it is just code i wrote to make sure things work.

let quiz;
axios.get("http://127.0.0.1:3000/api/quiz/linux").then((res)=>{
  console.log("Status:", res.status);
  quiz = res.data;
  console.log("QuizId:", quiz.uuid);
  console.log("Quiz", quiz)
  questions = []
  for (q of quiz.questions) {
    answers = []
    let nextAnswerShouldBe = true;
    for (a of q.answers) {
      answers.push({
        id: a.id,
        selected: nextAnswerShouldBe
      });
      if (nextAnswerShouldBe && !q.multiAnswers){
        nextAnswerShouldBe = false;
      }
    }

    questions.push({
      id: q.id,
      answers
    });
    break;
  }

  let data = {
    userId: "62740165bd0b9cb918bcd561",
    token: "7aaQQZYRII0T6By74c8fdCtKm+cqyiXTM0UFRK3lmMJ=",
    quizId: quiz.uuid,
    questions
  }
  
  console.log("Input:", JSON.stringify(data));
  axios.post("http://127.0.0.1:3000/api/quiz/submit", data=data).then(res=>{
    console.log("Output:", JSON.stringify(res.data));
  }).catch((e)=>{
    console.log("Submission Error:", e.response.data);
  });
}).catch((e)=>{
  console.log("An error occurred.");
})