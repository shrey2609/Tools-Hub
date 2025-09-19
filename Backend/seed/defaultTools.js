
const defaultTools = [
{
  id: "jira",
  name: "Jira",
  category: "Project Management",
  description: "Track and manage software projects efficiently.",

  officialLink: "https://www.atlassian.com/software/jira",
  guide: { 
    about: "Jira is a powerful project management tool developed by Atlassian, widely used for planning, tracking, and managing software development projects. It allows teams to organize tasks, monitor progress, and collaborate efficiently through customizable workflows, boards, and reports.",
    signup: "To sign up for Jira, visit the official Jira website. Click on the 'Try it free' or 'Sign up' button. You can create an account using your email address or your Google/Apple account. After signing up, you can choose between Jira Software, Jira Service Management, or Jira Core, depending on your team’s needs. Jira offers both cloud and self-managed (server/data center) options.",
    login: "To log in to Jira, go to the Jira website and click the 'Log in' button. Enter the email address and password you used during signup. If your organization uses Single Sign-On (SSO), you may log in through your company credentials. Once logged in, you will access your Jira dashboard with projects, boards, and issues you are part of.",
    usage: "Jira helps teams manage projects using boards, issues, and workflows. You can create tasks (issues), assign them to team members, set priorities, and track progress using Scrum or Kanban boards. Features like sprints, backlog management, and reporting help in planning and monitoring work. Integrations with tools like Confluence, GitHub, Slack, and automation rules further enhance productivity."
  }
},
{
  id: "sonarqube",
  name: "SonarQube",
  category: "Code Quality",
  description: "Static code analysis for maintaining quality.",

  officialLink: "https://www.sonarqube.org/",
  guide: { 
    about: "SonarQube is a popular platform for continuous inspection of code quality. It performs static code analysis to detect bugs, code smells, security vulnerabilities, and maintainability issues in multiple programming languages. Teams use SonarQube to ensure high-quality code and improve overall software reliability.",
    signup: "To sign up for SonarQube, visit the official website and choose the 'Get Started' or 'Sign Up' option. You can create a free account for SonarCloud (the cloud version) using your email, GitHub, Bitbucket, or Azure DevOps account. For the self-hosted SonarQube Server, you may need to download and set up the server on your own infrastructure.",
    login: "To log in, go to the SonarQube or SonarCloud website and click on the 'Log in' button. Enter your credentials created during signup. If using a connected account (like GitHub), you can log in via OAuth. Once logged in, you can access your dashboards, projects, and analysis reports.",
    usage: "SonarQube allows you to analyze code quality continuously. You can integrate it with your CI/CD pipelines (e.g., Jenkins, GitHub Actions, GitLab CI). After analyzing a project, it provides detailed reports highlighting bugs, vulnerabilities, code smells, and duplications. You can track trends, enforce quality gates, and ensure your code meets defined quality standards. SonarQube also supports multi-language projects and provides rich visualization through dashboards."
  }
},
  {
  "id": "prometheus",
  "name": "Prometheus",
  "category": "Monitoring",
  "description": "Monitoring system & time series database.",
  "officialLink": "https://prometheus.io/",
  "guide": {
    "about": "Prometheus is an open-source monitoring and alerting toolkit designed for reliability and scalability. It collects and stores metrics as time series data, providing powerful querying capabilities through PromQL. Prometheus is widely used for monitoring applications and infrastructure, offering features like multi-dimensional data model, flexible query language, and modern alerting approach.",
    "signup": "Prometheus is an open-source project and does not require a signup process. You can download and use it freely. Visit the official website to download the latest release suitable for your platform.",
    "login": "Prometheus does not have a traditional login system. Access to the Prometheus web interface is typically open by default. However, for security purposes, you can configure basic authentication to restrict access. This involves setting up a configuration file with user credentials and launching Prometheus with the appropriate flags. Detailed instructions are available in the official documentation.",
    "usage": "After downloading and extracting Prometheus, you can start it by running the 'prometheus' binary. By default, Prometheus listens on port 9090. You can access the web interface by navigating to 'http://localhost:9090' in your browser. To monitor your systems, you need to configure Prometheus to scrape metrics from your targets by editing the 'prometheus.yml' configuration file. For example, to monitor the Prometheus server itself, you can add a job configuration like:\n\n```yaml\nscrape_configs:\n  - job_name: 'prometheus'\n    static_configs:\n      - targets: ['localhost:9090']\n```"
  }
},
  {
    "id": "grafana",
    "name": "Grafana",
    "category": "Monitoring",
    "description": "Visualization & analytics for metrics.",
    "officialLink": "https://grafana.com/",
    "guide": {
      "about": "Grafana is an open-source platform for monitoring and observability. It allows you to query, visualize, alert on, and explore your metrics, logs, and traces wherever they are stored.",
      "signup": "To sign up for Grafana Cloud, visit the official website and click on 'Start for free'. Follow the instructions to finish setting up your account and access the Cloud Account Portal.",
      "login": "To log in to Grafana Cloud, go to the Grafana sign-in page and enter your credentials. If you're using a self-hosted Grafana instance, access it via the URL specified during setup.",
      "usage": "After logging in, you can create dashboards, add data sources, and set up alerts. Grafana supports various data sources like Prometheus, InfluxDB, and more. You can also explore data using the 'Explore' feature for ad-hoc queries."
    }
  },
  {
    "id": "docker",
    "name": "Docker",
    "category": "Containerization",
    "description": "Containerize applications for easy deployment.",
    "officialLink": "https://www.docker.com/",
    "guide": {
      "about": "Docker is an open-source platform designed to automate the deployment, scaling, and management of applications. It uses containerization technology to package applications and their dependencies into a standardized unit for software development.",
      "signup": "To sign up for Docker, visit the official website and click on 'Sign Up'. Enter a unique, valid email address, choose a username (4 to 30 characters, lowercase letters and digits only), and set a password that's at least 9 characters long.",
      "login": "To log in to Docker, go to the Docker sign-in page and enter your credentials. Alternatively, you can use the 'docker login' command in your terminal, providing your username and password or access token.",
      "usage": "After logging in, you can start using Docker by pulling images from Docker Hub using 'docker pull <image-name>', running containers with 'docker run <image-name>', and managing them using various Docker commands. For a comprehensive guide, refer to the Docker Get Started tutorial."
    }
  },
 {
  id: "kubernetes",
  name: "Kubernetes",
  category: "Container Orchestration",
  description: "Automate deployment, scaling & management of containers.",
  officialLink: "https://kubernetes.io/",
  guide: {
    about: "Kubernetes is an open-source platform for automating deployment, scaling, and management of containerized applications. It organizes containers into logical units called pods, making it easier to deploy, scale, and maintain applications reliably across different environments.",
    signup: "Kubernetes is open-source and does not require a signup. You can download it or use hosted cloud versions such as Google Kubernetes Engine (GKE), Amazon EKS, or Azure AKS, which may require creating an account with the respective cloud provider.",
    login: "Kubernetes does not have a traditional login. Access is managed through authentication methods such as certificates, bearer tokens, or cloud provider credentials. Users authenticate to the Kubernetes API server to manage clusters.",
    usage: "After setting up a Kubernetes cluster (locally with Minikube or on a cloud provider), you can manage it using the 'kubectl' command-line tool. You can deploy applications with 'kubectl apply', manage pods, services, and deployments, scale workloads, and monitor cluster status. Configuration is done through YAML manifests defining the desired state of resources."
  }
},
 {
  id: "gcp",
  name: "GCP",
  category: "Cloud Platform",
  description: "Google Cloud Platform for cloud computing services.",
  officialLink: "https://cloud.google.com/",
  guide: {
    about: "Google Cloud Platform (GCP) is a suite of cloud computing services provided by Google. It offers scalable infrastructure, data storage, machine learning, networking, and application development services. GCP enables businesses to build, deploy, and manage applications on Google’s global infrastructure, ensuring reliability, security, and high performance.",
    signup: "To use GCP, visit the official website and click on 'Get started for free'. You can create an account using your Google credentials. New users often get free credits to explore GCP services and experiment with various cloud solutions.",
    login: "To log in to GCP, go to the Google Cloud Console (https://console.cloud.google.com/) and sign in with your Google account. After logging in, you can access all your projects, resources, billing information, and services from the console.",
    usage: "After logging in, you can create projects to organize resources, deploy virtual machines, set up databases, and use managed services like BigQuery, Cloud Storage, and Kubernetes Engine. GCP provides a web console, command-line tools (gcloud), and APIs to manage and automate cloud resources efficiently. You can also monitor usage, configure billing alerts, and secure your resources using Identity and Access Management (IAM)."
  }
},
 {
  id: "ansible",
  name: "Ansible",
  category: "Automation",
  description: "Automate IT tasks & configuration management.",
  officialLink: "https://www.ansible.com/",
  guide: {
    about: "Ansible is an open-source automation tool for IT tasks such as configuration management, application deployment, and orchestration. It uses simple, human-readable YAML-based playbooks to define automation tasks, making it easy for teams to manage infrastructure consistently and efficiently.",
    signup: "Ansible itself is open-source and does not require signup. However, you can create an account on Ansible Automation Platform (by Red Hat) or the Ansible Galaxy community platform to access advanced features, modules, and shared roles.",
    login: "Logging in depends on the platform. For Ansible Galaxy or the Automation Platform, you can sign in using your registered credentials. For local Ansible usage, no login is required as it runs via the command line on your system with proper permissions.",
    usage: "After installing Ansible, you can write playbooks to automate tasks across multiple servers. Using commands like 'ansible-playbook', you can execute tasks such as installing software, managing users, configuring services, and orchestrating complex workflows. Ansible connects via SSH or WinRM, eliminating the need for agents on target machines, which simplifies management at scale."
  }
},
  {
  id: "jenkins",
  name: "Jenkins",
  category: "CI/CD",
  description: "Automation server for continuous integration and deployment.",
  officialLink: "https://www.jenkins.io/",
  guide: {
    about: "Jenkins is an open-source automation server that helps automate the building, testing, and deployment of software projects. It supports continuous integration (CI) and continuous delivery/deployment (CD), enabling teams to detect issues early, improve software quality, and accelerate delivery.",
    signup: "Jenkins itself is open-source and does not require signup. However, if you are using cloud-hosted Jenkins services or plugins requiring external accounts, you may need to register on those platforms separately.",
    login: "For a self-hosted Jenkins instance, you log in using the credentials set during installation. Cloud-hosted Jenkins instances may use different authentication methods like GitHub, Google, or LDAP. Once logged in, you can access dashboards, jobs, and configuration settings.",
    usage: "After installing Jenkins, you can create jobs or pipelines to automate tasks like building code, running tests, and deploying applications. Jenkins supports freestyle jobs and pipeline-as-code (using Jenkinsfile). It integrates with version control systems (e.g., Git), build tools (e.g., Maven, Gradle), and deployment platforms to create a full CI/CD workflow."
  }
},
  {
  id: "reactjs",
  name: "ReactJS",
  category: "Frontend",
  description: "Library for building user interfaces.",
  officialLink: "https://reactjs.org/",
  guide: {
    about: "ReactJS is an open-source JavaScript library developed by Facebook for building dynamic and interactive user interfaces. It allows developers to create reusable UI components and efficiently update the DOM using a virtual DOM for better performance.",
    signup: "ReactJS itself does not require any signup as it is a library. To access tutorials, documentation, or community resources, you can create an account on the official React website or GitHub, but it is optional.",
    login: "No login is required to use ReactJS locally. If using online tools like CodeSandbox or StackBlitz to practice React development, you may need to log in to save projects or access premium features.",
    usage: "To use ReactJS, you can install it via npm or yarn (`npm install react react-dom`) in your project. You can create components using JSX, manage state using hooks or class components, and render them to the DOM using `ReactDOM.render`. React integrates with tools like Redux for state management and React Router for navigation, enabling scalable frontend development."
  }
},
 {
  id: "redux",
  name: "Redux",
  category: "Frontend State Management",
  description: "Predictable state container for JS apps.",
  officialLink: "https://redux.js.org/",
  guide: {
    about: "Redux is an open-source JavaScript library for managing application state in a predictable way. It centralizes the state of an application in a single store, allowing components to access and update state consistently, making debugging and testing easier.",
    signup: "Redux itself does not require any signup as it is a library. To access official documentation, tutorials, or community resources, you can create an account on the Redux website or GitHub, but this is optional.",
    login: "No login is required to use Redux locally. If using online development environments like CodeSandbox, StackBlitz, or GitHub for collaborative projects, you may need to log in to those platforms.",
    usage: "To use Redux, install it via npm or yarn (`npm install redux react-redux`). Define a central store to hold your application state, create actions to describe state changes, and reducers to handle updates. Connect your components to the store using the `Provider` component and `useSelector`/`useDispatch` hooks for state access and updates, ensuring a predictable state flow across your application."
  }
},
  {
  id: "tailwindcss",
  name: "TailwindCSS",
  category: "Frontend CSS Framework",
  description: "Utility-first CSS framework for rapid UI development.",
  officialLink: "https://tailwindcss.com/",
  guide: {
    about: "TailwindCSS is a utility-first CSS framework that allows developers to build custom user interfaces quickly by applying pre-defined utility classes directly in HTML. It promotes a highly customizable and responsive design workflow without writing custom CSS for every component.",
    signup: "TailwindCSS itself is open-source and does not require signup. To access additional resources, templates, or the Tailwind Play online editor, you can optionally create an account on the official Tailwind website.",
    login: "No login is required to use TailwindCSS locally. If using Tailwind Play (the online playground) or premium Tailwind UI components, you may need to log in with your Tailwind account.",
    usage: "To use TailwindCSS, install it via npm (`npm install tailwindcss`) and configure it using the provided configuration file (`tailwind.config.js`). You can then apply utility classes in your HTML or JSX files to style elements. Tailwind supports responsive design, custom themes, and plugins, making it efficient to build fully responsive and visually consistent user interfaces."
  }
},
  {
  id: "nodejs",
  name: "NodeJS",
  category: "Backend",
  description: "JavaScript runtime for server-side development.",
  officialLink: "https://nodejs.org/",
  guide: {
    about: "NodeJS is an open-source, cross-platform JavaScript runtime environment that allows developers to run JavaScript on the server side. It uses an event-driven, non-blocking I/O model, making it lightweight and efficient for building scalable network applications and backend services.",
    signup: "NodeJS itself is open-source and does not require signup. You can download and install it freely from the official website. For cloud-based development platforms or package repositories like npm, you may need to create an account to publish or manage packages.",
    login: "No login is required to use NodeJS locally. For npm (Node Package Manager), you can log in using the command `npm login` with your npm account credentials to publish or manage packages.",
    usage: "After installing NodeJS, you can run JavaScript files on the server using the `node <filename>` command. NodeJS provides a rich ecosystem of libraries through npm. You can create web servers, APIs, real-time applications, and automate tasks. It integrates well with frameworks like Express.js for building server-side applications efficiently."
  }
},
{
  id: "expressjs",
  name: "ExpressJS",
  category: "Backend",
  description: "Web framework for Node.js applications.",
  officialLink: "https://expressjs.com/",
  guide: {
    about: "ExpressJS is a fast, minimal, and flexible web application framework for Node.js. It provides a robust set of features for building web and mobile applications, such as routing, middleware support, and HTTP utility methods, enabling developers to create APIs and server-side applications efficiently.",
    signup: "ExpressJS itself is open-source and does not require signup. You can download and use it freely via npm (`npm install express`). For accessing documentation, tutorials, or community support, no signup is necessary.",
    login: "No login is required to use ExpressJS locally. If using online platforms like Glitch, Replit, or GitHub for collaborative development, you may need to log in to those platforms.",
    usage: "After installing ExpressJS, you can create a server by requiring the Express module and defining routes to handle HTTP requests. Express allows middleware functions to process requests and responses, making it simple to implement REST APIs, web services, and integrate with databases or frontend frameworks. Typical usage involves setting up routes, handling requests, and sending responses using `app.get()`, `app.post()`, etc."
  }
},
 {
  id: "mongodb",
  name: "MongoDB",
  category: "Database",
  description: "NoSQL document database for modern apps.",
  officialLink: "https://www.mongodb.com/",
  guide: {
    about: "MongoDB is an open-source NoSQL database that stores data in flexible, JSON-like documents. It allows developers to build scalable, high-performance applications with dynamic schemas, making it ideal for modern web, mobile, and cloud applications.",
    signup: "To use MongoDB Atlas (the cloud service), visit the official MongoDB website and click on 'Start Free'. You can sign up using your email, Google, or GitHub account. For self-hosted MongoDB, no signup is required; you can download and install it freely.",
    login: "To log in to MongoDB Atlas, go to the Atlas console and enter your credentials. For self-hosted MongoDB, access is controlled via database users and authentication configured during setup.",
    usage: "After setting up MongoDB, you can create databases, collections, and documents. Use the MongoDB shell, Compass GUI, or drivers for different programming languages to perform CRUD operations. MongoDB supports indexing, aggregation, replication, and sharding to manage data efficiently at scale."
  }
},
  {
  id: "github",
  name: "GitHub",
  category: "Version Control",
  description: "Host code repositories and collaborate with your team.",
  officialLink: "https://docs.github.com/en",
  guide: {
    about: "GitHub is a web-based platform for version control and collaborative software development using Git. It allows developers to host code repositories, track changes, manage projects, and collaborate with teams globally. GitHub also provides features like pull requests, issues, actions, and project boards to streamline development workflows.",
    signup: "To use GitHub, visit the official website and click on 'Sign up'. You can register using your email address and create a username and password. GitHub also allows signing up using Google or GitHub Enterprise accounts.",
    login: "To log in, visit the GitHub website and enter your credentials. You can also log in using OAuth providers like Google or GitHub Enterprise. Once logged in, you can access repositories, manage projects, and collaborate with other developers.",
    usage: "After logging in, you can create repositories, clone them locally using Git, commit changes, and push updates to GitHub. You can collaborate with teams by creating branches, opening pull requests, reviewing code, and using GitHub Actions for CI/CD automation. GitHub also integrates with various development tools to enhance workflow efficiency."
  }
},
  {
  id: "git",
  name: "Git",
  category: "Version Control",
  description: "Distributed version control system.",
  officialLink: "https://git-scm.com/",
  guide: {
    about: "Git is an open-source distributed version control system that tracks changes in source code during software development. It allows multiple developers to collaborate efficiently, maintain history, and manage branching and merging of code seamlessly.",
    signup: "Git itself does not require signup. You can download and install it freely from the official website. If you use Git in conjunction with hosting services like GitHub, GitLab, or Bitbucket, you will need to create an account on those platforms.",
    login: "No login is required to use Git locally. When using Git with remote repositories on platforms like GitHub or GitLab, you authenticate using credentials, SSH keys, or personal access tokens.",
    usage: "After installing Git, you can initialize a repository using `git init`, clone repositories using `git clone`, track changes with `git add` and `git commit`, and push updates to remote repositories with `git push`. Git also allows branching and merging to manage feature development and collaboration efficiently."
  }
},
  {
  id: "vercel",
  name: "Vercel",
  category: "Deployment",
  description: "Frontend hosting & serverless deployment platform.",
  officialLink: "https://vercel.com/docs",
  guide: {
    about: "Vercel is a cloud platform for deploying frontend applications and serverless functions. It provides instant global deployments, optimized performance, and seamless integration with frameworks like Next.js, React, and Vue. Vercel simplifies the deployment process and enables developers to focus on building features rather than infrastructure.",
    signup: "To use Vercel, visit the official website and click 'Sign Up'. You can register using your GitHub, GitLab, Bitbucket account, or email. Signing up allows you to create projects, deploy applications, and manage environments.",
    login: "To log in, go to the Vercel website and sign in using the account you created. You can also log in via GitHub, GitLab, or Bitbucket OAuth for easy project linking.",
    usage: "After logging in, you can create a new project by linking a Git repository or uploading your code. Vercel automatically builds and deploys the project, providing a unique deployment URL. You can configure custom domains, environment variables, and serverless functions. Vercel also integrates with Git for continuous deployment, automatically updating your site with every push to the repository."
  }
},
  {
  id: "netlify",
  name: "Netlify",
  category: "Deployment",
  description: "Deploy static websites & frontend apps.",
  officialLink: "https://www.netlify.com/",
  guide: {
    about: "Netlify is a cloud platform for deploying static websites and frontend applications. It provides continuous deployment, serverless functions, form handling, and global content delivery to simplify hosting and scaling web projects efficiently.",
    signup: "To use Netlify, visit the official website and click on 'Sign Up'. You can create an account using GitHub, GitLab, Bitbucket, or email. Signing up allows you to deploy projects, manage domains, and access advanced features.",
    login: "To log in, go to the Netlify website and enter your account credentials. You can also log in using GitHub, GitLab, or Bitbucket OAuth for seamless project integration and automatic deployments.",
    usage: "After logging in, you can create a new site by connecting a Git repository or uploading your project files. Netlify automatically builds and deploys your site. You can configure custom domains, SSL, serverless functions, and environment variables. Netlify also supports continuous deployment, automatically updating your site with each push to the linked repository."
  }
},
 {
  id: "render",
  name: "Render",
  category: "Deployment",
  description: "Cloud hosting platform for apps & services.",
  officialLink: "https://render.com/",
  guide: {
    about: "Render is a unified cloud platform for hosting web applications, static sites, databases, and backend services. It provides automated deployments, SSL, CDN, and scalable infrastructure, enabling developers to focus on building applications rather than managing servers.",
    signup: "To use Render, visit the official website and click 'Sign Up'. You can create an account using GitHub, GitLab, or email. Signing up allows you to create projects, deploy applications, and manage resources.",
    login: "To log in, go to the Render website and enter your credentials or authenticate via GitHub/GitLab. Once logged in, you can access your dashboards, manage services, and view logs and metrics.",
    usage: "After logging in, you can create a new service by connecting a Git repository or uploading your project. Render automatically builds and deploys your applications. You can configure environment variables, custom domains, databases, and monitor performance. Continuous deployment is supported, updating your app automatically with each code push."
  }
},
{
  id: "postman",
  name: "Postman",
  category: "API Testing",
  description: "Test APIs efficiently.",
  officialLink: "https://learning.postman.com/docs/introduction/overview/",
  guide: {
    about: "Postman is a collaboration platform for API development and testing. It allows developers to design, test, and document APIs efficiently, supporting automated testing, mock servers, and monitoring to ensure APIs work as expected.",
    signup: "To use Postman, visit the official website and click 'Sign Up'. You can register using your email, Google, or GitHub account. Signing up enables saving collections, collaborating with teams, and accessing cloud features.",
    login: "To log in, go to the Postman website or desktop app and enter your credentials. You can also log in using OAuth providers like Google or GitHub. Logging in allows access to saved collections, environments, and shared team resources.",
    usage: "After logging in, you can create requests to test APIs by specifying the HTTP method, URL, headers, and body. Postman supports running collections, scripting tests, and automating workflows. You can also use environments to manage variables and collaborate with team members by sharing collections and monitoring API performance."
  }
},
 {
  id: "hoppscotch",
  name: "Hoppscotch",
  category: "API Testing",
  description: "Alternative API tester.",
  officialLink: "https://hoppscotch.io/",
  guide: {
    about: "Hoppscotch is a lightweight, open-source API development and testing tool. It allows developers to send requests, inspect responses, and debug APIs quickly without needing heavy desktop applications. It supports REST, WebSocket, GraphQL, and other protocols.",
    signup: "Hoppscotch can be used without signing up. However, creating a free account allows you to save your requests, collections, and environments in the cloud for easy access across devices.",
    login: "To log in, visit the Hoppscotch website and sign in using your registered email or through OAuth providers like GitHub or Google. Logging in lets you sync and manage your saved API requests across devices.",
    usage: "After logging in (or using without login), you can create API requests by selecting the HTTP method, entering the URL, and adding headers or body data. You can organize requests into collections, test APIs, and view responses. Hoppscotch also supports scripting, environment variables, and real-time collaboration for teams."
  }
}
];

export default defaultTools;
