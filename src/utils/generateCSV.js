const fs = require('fs');
const { parse } = require('json2csv');

const questions = [
  {
    title: 'What is the difference between `let` and `const` in JavaScript?',
    difficulty: 'easy',
    categories: ['javascript', 'webdev'],
  },
  {
    title: 'Explain the concept of closures in JavaScript.',
    difficulty: 'medium',
    categories: ['javascript', 'functionalprogramming'],
  },
  {
    title: 'How does the `this` keyword work in JavaScript?',
    difficulty: 'medium',
    categories: ['javascript', 'fundamentals'],
  },
  {
    title: 'What is event delegation in JavaScript?',
    difficulty: 'medium',
    categories: ['javascript', 'dom'],
  },
  {
    title: 'Explain the concept of prototypal inheritance in JavaScript.',
    difficulty: 'hard',
    categories: ['javascript'],
  },
  {
    title:
      'What is the purpose of the `async` and `await` keywords in JavaScript?',
    difficulty: 'medium',
    categories: ['javascript', 'asynchronousprogramming'],
  },
  {
    title: 'How do you handle errors in asynchronous JavaScript code?',
    difficulty: 'medium',
    categories: ['javascript'],
  },
  {
    title: 'What is the Virtual DOM and how does React use it?',
    difficulty: 'easy',
    categories: ['react'],
  },
  {
    title: 'Explain the concept of state and props in React.',
    difficulty: 'medium',
    categories: ['react'],
  },
  {
    title: "How does React's lifecycle methods work?",
    difficulty: 'medium',
    categories: ['react'],
  },
  {
    title: 'What are hooks in React? Provide examples.',
    difficulty: 'medium',
    categories: ['react'],
  },
  {
    title:
      'Explain the difference between controlled and uncontrolled components in React.',
    difficulty: 'medium',
    categories: ['react'],
  },
  {
    title: 'What is the purpose of `useEffect` in React?',
    difficulty: 'medium',
    categories: ['react'],
  },
  {
    title: 'How do you manage state in a React application?',
    difficulty: 'medium',
    categories: ['react', 'statemanagement'],
  },
  {
    title: 'What are some best practices for optimizing React performance?',
    difficulty: 'hard',
    categories: ['react', 'performance'],
  },
  {
    title: 'How do you test React components?',
    difficulty: 'medium',
    categories: ['react', 'testing'],
  },
  {
    title: 'What is Node.js and how does it work?',
    difficulty: 'easy',
    categories: ['node.js', 'backend'],
  },
  {
    title: 'Explain the concept of middleware in Express.js.',
    difficulty: 'medium',
    categories: ['node.js', 'backendfundamentals'],
  },
  {
    title: 'How do you handle errors in a Node.js application?',
    difficulty: 'medium',
    categories: ['node.js', 'errorhandling'],
  },
  {
    title: 'What is the purpose of `npm` in Node.js?',
    difficulty: 'easy',
    categories: ['node.js', 'npm'],
  },
  {
    title: 'Explain the use of Promises in Node.js.',
    difficulty: 'medium',
    categories: ['node.js'],
  },
  {
    title: 'What is the role of `package.json` in a Node.js project?',
    difficulty: 'easy',
    categories: ['node.js'],
  },
  {
    title: 'How do you handle asynchronous operations in Node.js?',
    difficulty: 'medium',
    categories: ['node.js'],
  },
  {
    title: 'Explain the concept of streams in Node.js.',
    difficulty: 'hard',
    categories: ['node.js', 'stream'],
  },
  {
    title: 'What is TypeScript and why would you use it?',
    difficulty: 'easy',
    categories: ['typescript'],
  },
  {
    title: 'Explain the concept of interfaces in TypeScript.',
    difficulty: 'medium',
    categories: ['typescript'],
  },
  {
    title: 'How do you define a class in TypeScript?',
    difficulty: 'easy',
    categories: ['typescript'],
  },
  {
    title: 'What are the advantages of using TypeScript over JavaScript?',
    difficulty: 'medium',
    categories: ['typescript'],
  },
  {
    title: 'How do you perform type checking in TypeScript?',
    difficulty: 'medium',
    categories: ['typescript'],
  },
  {
    title: 'Explain the concept of generics in TypeScript.',
    difficulty: 'hard',
    categories: ['typescript'],
  },
  {
    title: 'What is the role of `tsconfig.json` in a TypeScript project?',
    difficulty: 'easy',
    categories: ['typescript'],
  },
  {
    title: 'How do you integrate TypeScript with existing JavaScript projects?',
    difficulty: 'medium',
    categories: ['typescript'],
  },
  {
    title: 'What is Docker and how does it work?',
    difficulty: 'medium',
    categories: ['docker', 'backend'],
  },
  {
    title: 'Explain the concept of containerization and its benefits.',
    difficulty: 'medium',
    categories: ['docker'],
  },
  {
    title: 'How do you create a Dockerfile?',
    difficulty: 'medium',
    categories: ['docker'],
  },
  {
    title:
      'What is the difference between Docker and traditional virtual machines?',
    difficulty: 'medium',
    categories: ['docker'],
  },
  {
    title: 'How do you manage Docker images and containers?',
    difficulty: 'medium',
    categories: ['docker'],
  },
  {
    title: 'What is Docker Compose and how is it used?',
    difficulty: 'medium',
    categories: ['docker'],
  },
  {
    title: 'Explain the concept of orchestration in Docker.',
    difficulty: 'hard',
    categories: ['docker'],
  },
  {
    title: 'What is GraphQL and how does it differ from REST?',
    difficulty: 'medium',
    categories: ['graphql'],
  },
  {
    title: 'Explain the concept of queries and mutations in GraphQL.',
    difficulty: 'medium',
    categories: ['graphql'],
  },
  {
    title: 'How do you set up a basic GraphQL server?',
    difficulty: 'medium',
    categories: ['graphql'],
  },
  {
    title: 'What are GraphQL schemas and resolvers?',
    difficulty: 'medium',
    categories: ['graphql'],
  },
  {
    title: 'How does GraphQL handle authentication and authorization?',
    difficulty: 'hard',
    categories: ['graphql'],
  },
  {
    title: 'Explain the concept of subscriptions in GraphQL.',
    difficulty: 'hard',
    categories: ['graphql'],
  },
  {
    title: 'What is the purpose of GraphQL fragments?',
    difficulty: 'medium',
    categories: ['graphql'],
  },
  {
    title: 'What is DevOps and what are its key principles?',
    difficulty: 'medium',
    categories: ['devops'],
  },
  {
    title:
      'Explain the concept of continuous integration and continuous deployment (CI/CD).',
    difficulty: 'medium',
    categories: ['devops'],
  },
  {
    title: 'How do you implement infrastructure as code (IaC)?',
    difficulty: 'medium',
    categories: ['devops'],
  },
  {
    title: 'What are some popular CI/CD tools?',
    difficulty: 'medium',
    categories: ['devops'],
  },
  {
    title: 'Explain the concept of container orchestration.',
    difficulty: 'hard',
    categories: ['devops'],
  },
  {
    title: 'How do you monitor and log applications in a DevOps environment?',
    difficulty: 'hard',
    categories: ['devops'],
  },
  {
    title: 'What is the role of version control systems in DevOps?',
    difficulty: 'medium',
    categories: ['devops'],
  },
  {
    title: 'How do you manage secrets and configuration in a DevOps pipeline?',
    difficulty: 'hard',
    categories: ['devops'],
  },
  {
    title: 'What is API Gateway and why is it used?',
    difficulty: 'medium',
    categories: ['apis'],
  },
  {
    title: 'Explain the concept of rate limiting in APIs.',
    difficulty: 'medium',
    categories: ['apis'],
  },
  {
    title: 'How do you secure APIs against common vulnerabilities?',
    difficulty: 'hard',
    categories: ['apis'],
  },
  {
    title:
      'What is the purpose of API documentation and what tools are used for it?',
    difficulty: 'medium',
    categories: ['apis'],
  },
  {
    title: 'How do you handle API versioning?',
    difficulty: 'medium',
    categories: ['apis'],
  },
  {
    title: 'Explain the concept of request throttling.',
    difficulty: 'medium',
    categories: ['apis'],
  },
  {
    title: 'How do you test APIs effectively?',
    difficulty: 'medium',
    categories: ['apis'],
  },
  {
    title: 'What are some best practices for designing RESTful APIs?',
    difficulty: 'hard',
    categories: ['apis'],
  },
  {
    title: 'What is serverless architecture and what are its benefits?',
    difficulty: 'medium',
    categories: ['serverless'],
  },
  {
    title: 'How do you deploy a serverless application?',
    difficulty: 'medium',
    categories: ['serverless'],
  },
  {
    title: 'Explain the concept of Function as a Service (FaaS).',
    difficulty: 'medium',
    categories: ['serverless'],
  },
  {
    title: 'What are some common use cases for serverless computing?',
    difficulty: 'medium',
    categories: ['serverless'],
  },
  {
    title: 'How do you manage state in a serverless application?',
    difficulty: 'hard',
    categories: ['serverless', 'aws'],
  },
  {
    title: 'What are the challenges of serverless architecture?',
    difficulty: 'hard',
    categories: ['serverless', 'aws'],
  },
  {
    title: 'How do you handle cold starts in serverless functions?',
    difficulty: 'hard',
    categories: ['serverless', 'aws'],
  },
  {
    title:
      'What is microservices architecture and how is it different from monolithic architecture?',
    difficulty: 'medium',
    categories: ['microservices'],
  },
  {
    title: 'How do you handle communication between microservices?',
    difficulty: 'medium',
    categories: ['microservices'],
  },
  {
    title: 'What are the benefits of using microservices?',
    difficulty: 'medium',
    categories: ['microservices'],
  },
  {
    title:
      'How do you manage data consistency in a microservices architecture?',
    difficulty: 'hard',
    categories: ['microservices'],
  },
  {
    title: 'What are the challenges of implementing microservices?',
    difficulty: 'hard',
    categories: ['microservices'],
  },
  {
    title: 'How do you test microservices effectively?',
    difficulty: 'hard',
    categories: ['microservices'],
  },
  {
    title: 'What is a message broker and why is it used in microservices?',
    difficulty: 'medium',
    categories: ['microservices', 'messaging'],
  },
  {
    title:
      'How do you implement fault tolerance in a microservices architecture?',
    difficulty: 'hard',
    categories: ['microservices'],
  },
  {
    title: 'What are the differences between SQL and NoSQL databases?',
    difficulty: 'medium',
    categories: ['databases'],
  },
  {
    title: 'How do you choose between SQL and NoSQL databases?',
    difficulty: 'medium',
    categories: ['databases'],
  },
  {
    title: 'What is database normalization and why is it important?',
    difficulty: 'medium',
    categories: ['databases'],
  },
  {
    title: 'Explain the concept of ACID properties in databases.',
    difficulty: 'medium',
    categories: ['databases'],
  },
  {
    title: 'How do you perform database indexing and what are its benefits?',
    difficulty: 'medium',
    categories: ['databases'],
  },
  {
    title: 'What is a schema in a database and why is it important?',
    difficulty: 'medium',
    categories: ['databases'],
  },
  {
    title: 'What are some common database design patterns?',
    difficulty: 'hard',
    categories: ['databases'],
  },
  {
    title: 'How do you handle database migrations?',
    difficulty: 'medium',
    categories: ['databases'],
  },
  {
    title: 'What is a data warehouse and how does it differ from a database?',
    difficulty: 'hard',
    categories: ['databases', 'datawarehousing'],
  },
  {
    title: 'How do you implement data backup and recovery strategies?',
    difficulty: 'hard',
    categories: ['databases', 'dataintegrity'],
  },
];

// Function to transform categories array into a comma-separated string
const transformCategories = (categories) => {
  return categories.join(',');
};

// Function to write data to a CSV file
const generateCsv = () => {
  // Convert questions to the correct format for CSV
  const data = questions.map((question) => ({
    title: question.title,
    difficulty: question.difficulty,
    categories: transformCategories(question.categories), // Use custom transformation
  }));

  // Define the fields for the CSV
  const fields = [
    { label: 'Title', value: 'title' },
    { label: 'Difficulty', value: 'difficulty' },
    { label: 'Categories', value: 'categories' },
  ];

  // Convert JSON to CSV
  const csv = parse(data, { fields, header: true });

  // Define file path
  const filePath = 'programming_questions_real.csv';

  // Write CSV file
  fs.writeFile(filePath, csv, (err) => {
    if (err) {
      console.error('Error writing CSV file:', err);
    } else {
      console.log(
        `CSV file with ${data.length} entries has been saved as ${filePath}`
      );
    }
  });
};

module.exports = { generateCsv };
