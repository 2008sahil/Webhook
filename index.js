const express = require('express');
const bodyParser=require("body-parser")
const cors=require("cors")
const app = express();
const PORT = 5000;


app.use(express.json());
app.use(bodyParser.json())
app.use(cors())




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
  
      // Retrieve linked projects from your database based on the repository name
      // const linkedProjects = await fetchLinkedProjects(repositoryName);
  
      // // Trigger deployment for each linked project
      // await Promise.all(linkedProjects.map(async (project) => {
      //   try {
      //     await vercelAPI.deployProject(project); // Example function to deploy project using Vercel API
      //     console.log(`Deployment triggered for project: ${project.name}`);
      //   } catch (error) {
      //     console.error(`Error deploying project ${project.name}:`, error);
      //     // Handle deployment errors
      //   }
      // }));
  
      return res.status(200).send('Webhook received successfully');
    } else {
      return res.status(400).send('Unsupported event type');
    }
  });

  
const server=app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
