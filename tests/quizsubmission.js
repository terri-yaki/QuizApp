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
        console.log("submissing false");
        nextAnswerShouldBe = false;
      }
    }

    questions.push({
      id: q.id,
      answers
    });
  }

  let data = {
    userId: "627148757b2d677dc2ad5bae",
    token: "+5P3VVOEMm+cPHvpdhba80PFJz9BtFHT9KDmx507TdQ=",
    quizId: quiz.uuid,
    questions
  }

  axios.post("http://127.0.0.1:3000/api/quiz/submit", data=data).then(res=>{
    console.log(JSON.stringify(res.data));
  }).catch((e)=>{
    console.log("Submission Error:", e.response.data);
  });
}).catch((e)=>{
  console.log("An error occurred.");
})