# QuizApp API Documentation
Please note that this API is work in progress and methods and/or notices may be subject to change.
All methods described here will be on the `/api` path.
A status code of **500** means that there has been an internal server error and the request coud not be completed. Strings in API parameters do not include the quotes. Please remember to URL encode your query. Requests that require authentication require the user's UUID and Session Token.

## Users
### Creating an acccount
Creates a user account and return the details of the user with a session token.

Path: `/user/create`

Method: `POST`

Authentication Required: **No**

#### Parameters:
- `emailAddress`:`string` - A valid email address for the user's account.
- `displayName`:`string` - A display name for the user.
- `password`:`string` - A password for the user. (*TODO: Clarify password requirements.*)

#### Responses:
**200** - Ok. The user account was successfully created. The account details ans session will be returned in the following form:
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

Authentication Required: **Yes**

#### Parameters:
- `uuid`:`string` - The user's UUID.
- `token`:`string` - The current session token.

### Responses:
**200** - Ok. The user's session was revoked successfully.

**401** - Invalid Session. The user's token was invalid.

**404** - Not Found. A user could not be found for the given UUID.

## Quizzes
### Requesting a quiz
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
```json
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
        ... More Items...
      ],
      "multiAnswers": false,
      "tags": [],
      "category": "Linux",
      "difficulty": "Medium"
    },
    ... More Items ...
  ],
}
```

**400** - Invalid topic. Either no topic or an invalid topic was provided.
