const express = require('express');
const bodyParser=require("body-parser")
const cors=require("cors")
const app = express();
const PORT = 5000;
const dotenv = require("dotenv");

const connectDB = require("./config/db");
app.use(express.json());
app.use(bodyParser.json())
app.use(cors())

dotenv.config();
connectDB()
const Project=require('./models/ProjectSchema')
const User=require("./models/Userschema.js")




app.post('/github-webhook', async (req, res) => {
    const { body } = req;
  
    // Ensure the request is coming from GitHub
    const userAgent = req.headers['user-agent'];
    if (!userAgent || !userAgent.includes('GitHub-Hookshot')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  
    // Check if the event is a push event
    if (req.headers['x-github-event'] === 'push') {
      // Parse the payload to extract relevant information
      const repositoryName = body.repository.full_name;
  
      console.log(`Received push event for repository: ${repositoryName}`);
      const [username, userrepo] = repositoryName.split('/');
      const user = await User.findOne({ username });
      if (!user) return console.error(`User with username ${username} not found`);

      const projects = await Project.find({ userId: user._id, reponame: userrepo });
      if (!projects.length) return console.error(`No projects found for ${username}/${userrepo}`);

      await Promise.all(projects.map(async project => {
        try {
          // const deployment = await fetch('http://localhost:4000/project/create-deployment', {
          //   method: "POST",
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ projectId: project.ProjectId })
          // });
          // if (!deployment.ok) throw new Error(`Failed to create deployment for project ${project.name}`);
          console.log(`Deployment created for project: ${project.name} & project id of ${project.ProjectId} `);
        } catch (error) {
          console.error(`Error creating deployment for project: ${project.name}`, error);
        }
      }));
      
  
      return res.status(200).send('Webhook received successfully');
    } else {
      return res.status(400).send('Unsupported event type');
    }
  });

  
const server=app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
