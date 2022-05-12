# Quizapp
Made with 'create-next-app'.

## API Endpoint Documentation.
See [the api directory](/pages/api).

## Database
In order to use the database, you must provide a `DATABASE_URL` environment variable in your `.env.local` file (use 127.0.0.1 instead of localhost).


Please make sure you have an accessible MongoDB database running with write permissions.


## QuizAPI
To generate quizzes, there must be a QuizAPI key provided as `QUIZAPI_TOKEN` as an environment variable (`.env.local`).

## Notes:
1. The old html files and images have been put into the old-assets directory and should be moved into the public folder when used.
2. the product pitch files have been put into the pitch directory.

## To Get Started:

```bash
npm install
npm run dev
```

## Tips to Start Working:
1. Create a branch for your feature on github.
2. When done we can review the code and merge it.

### Frontend:
1. Take one aspect of your part and create a functional component in the '/components' directory.
2. This should be in the form 'ExampleComponent.tsx' and in a folder with the same name.
3. If you want the component to be rendered on a page already made (e.g. index.tsx) import it and then add it to the return function.
4. If you want the component to be rendered on a new page then make a 'examplePage.tsx' file in the '/pages' directory and create and export a new function.
5. css should be put into the '/styles' directory.

the boilerplate files '/pages/index.tsx' and '/components/ExampleComponent/ExampleComponent.tsx' should be able to help.

### Backend:
1. If you are creating an api endpoint for the frontend to use create a file in the form 'exampleEndpoint.ts' inside '/pages/api'.
2. If you are creating a helper function for the backend create a file in the form 'exampleHelper.ts' inside '/helpers'.

the boilerplate files '/pages/api/hello.ts' and '/helpers/exampleHelper.ts' should be able to help.

## Resources:
Possible way of doing user authentication:  
https://nextjs.org/docs/authentication  