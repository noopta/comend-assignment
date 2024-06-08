# comend-assignment
Interview assignment for Comend's interview process.

# Key Tasks Completed
Some of the key tasks include: 
- two backend endpoints for registering a user and logging in a user
- creating postgresql tables and querying them
- hosting the backend using Gin and AWS EC2
- front end able to send requests accordingly
- front end landing page + register + sign in + profile dashboard
- login session is stored using a globalized Auth class

# Running the project (Assuming you can already run Next.JS)
Front End:
1. The package.json should have all the required dependencies so simply running "npm install" should suffice.
2. Enter `npm run dev` in the CLI and hit enter and navigate to localhost:3000

Back End:
1. The server created with Golang, and Gin is being hosted on an EC2 instance that is already running so there is no additional setup required from the user's perspective.
2. No actions required here.

# User Flows
Registering a user = Landing -> Register -> Enter information and submit -> Click on new button prompt to go back to dashboard

Signing in = Landing -> Sign In -> Enter credentials and submit

# Additional Notes
Due to the role being a full stack one and with more emphasis on backend, while still constructing the full stack end to end project I placed more emphasis and analysis on backend engineering for this project. Focuses included low-latency, and potential to easily scale or run concurrent operations.       
