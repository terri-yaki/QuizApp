# QuizApp API Documentation
Please note that this API is work in progress and methods and/or notices may be subject to change.
All methods described here will be on the `/api` path.
A status code of **500** means that there has been an internal server error and the request coud not be completed. Strings in API parameters do not include the quotes. Please remember to URL encode your query. Requests that require authentication require the user's UUID and Session Token.

## Users
### Creating an Acccount
Creates a user account and return the details of the user with a session token.

Path: `/user/create`

Method: `POST`

Content-Type: `application/x-www-form-urlencoded`

Authentication Required: **No**

#### Parameters:
- `emailAddress`:`string` - A valid email address for the user's account.
- `displayName`:`string` - A display name for the user.
- `password`:`string` - A password for the user. (*TODO: Clarify password requirements.*)

#### Responses:
**200** - Ok. The user account was successfully created. The account details and session will be returned in the following form:
```json
{
    "uuid":"627148757b2d677dc2ad5bae",
    "email":"dom@example.com",
    "displayName":"Dom",
    "session":{
        "token":"zzmnzJ7tKEi5zdoWg6D7vec/jkue8mUCZ9uuFfzMfXw=","expiry":"2022-05-04T15:21:25.095Z"
    }
}
```

**400** - Bad Request. A parameter specified was invalid or did not meet the requirements.

**409** - User Already Exists. A user account with this email address already exists.

### Logging In
Creates a session for a user.

Path: `/user/login`

Method: `POST`

Content-Type: `application/x-www-form-urlencoded`

Authentication Required: **No**

#### Parameters:
- `emailAddress`:`string` - The email address of the user.
- `password`:`string` - The password to log in with.

#### Responses:
**200** - Ok. The user account credentials were valid and correct. A session will be returned (response format is the same as [creating an account](#creating-an-acccount)).

**400** - Bad Request. One or more of the request parameters were invalid.

**401** - Incorrect credentials. An invalid username and/or password was provided.

### Logging Out
Revokes a session for a user.

Path: `/user/logout`

Method: `POST`

Content-Type: `application/x-www-form-urlencoded`

Authentication Required: **Yes**

#### Parameters:
- `uuid`:`string` - The user's UUID.
- `token`:`string` - The current session token.

#### Responses:
**200** - Ok. The user's session was revoked successfully.

**401** - Invalid Session. The user's token was invalid.

**404** - Not Found. A user could not be found for the given UUID.

## Quizzes
### Requesting a Quiz
Generates or retrieves a quiz for the current date and provided topic.

Path: `/quiz/[category]`

Method: `GET`

Authentication Required: **No**

#### Parameters:
- `category`:`string` - The category of the quiz. the following cateogories are available:
  - `"general"` - General Trivia from any category.
  - `"linux"`
  - `"code"`
  - `"devops"`
  - `"cms"`
  - `"sql"`

#### Responses:
**200** - Ok. A quiz will be returned. Below is an example of the data you can expect.:
```jsonc
{
  "uuid": "6271405584b18acea68c6389",
  "date": "2022-05-03T00:00:00.000Z",
  "topic": "linux",
  "questions": [
    {
      "id": 751,
      "question": "How to define an array in bash",
      "answers": [
        {
          "id": 0,
          "name": "array=(“Hi” “my” “name” “is”)"
        },
        /* ... More Items... */
      ],
      "multiAnswers": false,
      "tags": [],
      "category": "Linux",
      "difficulty": "Medium"
    },
    /* ... More Items ... */
  ],
}
```

**400** - Invalid topic. Either no topic or an invalid topic was provided.

### Requesting a Quiz (By ID)
Retrieves a quiz from the database by its ID.

Path: `/quiz/get?id=[id]`

Method: `GET`

Authentication Requured: **No**

#### Parameters:

- `id`:`string` - The ID of the quiz.

#### Responses:

**200** - Ok. Same response format as [requesting a quiz](#requesting-a-quiz).

**400** - Bad Request. Quiz ID provided was not a valid ID.

**404** - Not Found. A quiz could not be found with the provided ID.

### Submitting a Quiz
Submits a quiz that has been partially or fully completed. This can be one big submission or multiple smaller submissions. Unlike other POST requests, this one uses JSON instead of a URL-Encoded Querystring beacuse its structure is complex.

#### Request Format:
Path: `/quiz/submit`

Method: `POST`

Content-Type: `application/json`

Authentication Required: **Yes**

Data Structure (see [QuizSubmission.ts](https://github.com/TheGroup18SoftwareProject/TheQuizApp/blob/dc688ed08d69c5f8e03260f030022868954cd1a8/utils/structs/QuizSubmission.ts#L109) for the schema):
```jsonc
{
  "userId": "string", //User's UUID.
  "token": "string", //User's token.
  "quizId": "string", //Quiz UUID.
  "questions": { //Quiz questions.
    "id": "number" //Question ID.
    "answers": {
      "id": "number", //Answer ID.,
      "selected": "boolean" //Whether the answer has been selected or not.
    }[]
  }[]
}
```

#### Response:

**200** - Ok. The quiz was submitted successfully. A response will look something like this:
```jsonc
{
   "uuid":"62743143140381059c5bdb67",
   "quizId":"6273d2f6571dba3de63e1fd7",
   "complete":false,
   "score":4,
   "total":6,
   "lastUpdate":"2022-05-05T20:19:15.411Z",
   "questions":[
      {
         "id":662,
         "answers":[
            {
               "id":0,
               "selected":false,
               "correct":true
            },
            {
               "id":1,
               "selected":true,
               "correct":false
            },
            {
               "id":2,
               "selected":false,
               "correct":false
            },
            {
               "id":3,
               "selected":false,
               "correct":true
            }
         ]
      },
      /* ... More Items ...*/
   ]
}
```

**400** - Bad Request. Either the quiz ID was invalid, a non existent quiz question was present, or an answer was missing.

**404** - Not found. The quiz ID could not be resolved to quiz.

**409** - Cannot Overwrite. Quiz questions cannot be overwritten.

### Listing Quiz Submissions
Gets the submissions for a user. Note that a user can only view their own submission history.

Path: `/user/listsubmissions?uuid=[uuid]&token=[token]`

Method: `GET`

Authentication Required: **Yes**

### Parameters:

- `uuid`:`string` - The UUID of the user.
- `token`:`string` - The user's token.

#### Responses: 

**200** - Ok. Returns a list of objects using the format of [submitting a quiz](#submitting-a-quiz).

**400** - Bad request. A parameter passed was invalid.