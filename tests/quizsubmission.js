const axios = require("axios");
//very basic tests because NextJS is opaque and poorly documented imo so I cant actually use a TEST DB or anything.
//this is also why i am using JS.
//Don't run this unless you have my database, it is just code i wrote to make sure things work.

let quiz;
axios.get("http://127.0.0.1:3000/api/quiz/linux").then((res)=>{
  console.log("Status:", res.status);
  quiz = res.data;
  console.log("QuizId:", quiz.uuid);

  questions = []
  for (q of quiz.questions) {
    answers = []
    for (a of q.answers) {
      answers.push({
        id: a.id,
        selected: true
      });
    }
    console.log(q)

    questions.push({
      id: q.id,
      answers
    });
  }

  let data = {
    userId: "62740165bd0b9cb918bcd561",
    token: "YYzmY0i2cRguy/VbVzkpAQZam9gEW1TtedGDZqZr4uA=",
    quizId: quiz.uuid,
    questions
  }

  console.log("Payload: ", data);

  axios.post("http://127.0.0.1:3000/api/quiz/submit", data=data).then(res=>{
    console.log(JSON.stringify(res.data));
  });
}).catch((e)=>{
  console.log("An error occurred.");
})