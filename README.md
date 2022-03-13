# PatriotHacks-2022
## Inspiration
With the current refugee crisis and conflict in Ukraine, we were worried that people were losing contact with their loved ones. Our web application was inspired by both the Citizen App and Waze Maps in the ways that both applications allowed people to work together to share vital information quickly and effortlessly. We wanted our web app to allow users to connect with their loved ones, locate nearby shelters, disseminate information about dangerous situations, and facilitate financial services and assistance.

## What it does
Users can create a profile with their personal information (e.g. names, biography, etc.) to quickly connect and find other users and support services. Our web application allows users to check on the status of their loved ones, observe a heat map to circumvent dangerous areas, chat with other users, and send financial support with cryptocurrency wallets.

## How we built it
The first piece we built was the backend in node.js. Here, we defined most of the REST API routes that the frontend react.js application would interact with. Our node.js backend is also tied into our MongoDB Atlas database. Much of the authentication is done on the backend with passport.js. There is also a socket server running on the backend to allow for responsive chat communications. Four schemas were defined:  chat, message, user, and entry. The chat and message collections are used for the chat feature and the entry collection is used for mapping danger zones. For the frontend, some third-party libraries were used, but most of it was built from the ground up using bootstrap. The entire application stack is deployed on Heroku and is live!

## Challenges we ran into
We were having issues with our frontend development and implementing our chat feature between users. We mostly have developed the backend routes and tied them to the database within the first couple of hours of the hackathon; however, developing the front end and ensuring a streamlined, responsive, and intuitive user experience was a difficult process. Additionally, the live-chat feature was something that we have never done before by any of our members. Furthermore, implementing the crypto wallet transactions was difficult because MetaMask has changed the web3 interface. Moreover, deploying to Heroku caused some issues with Mapbox, because of an issue with webpack.

## Accomplishments that we're proud of
We are proud that we found a fun way to apply what we learned in our classes and side projects in a fast-paced environment to solve difficult problems. More specifically, we are most proud of the socket-based chat feature and the crypto transactions, and the heatmap.

## What we learned
We learned how to plot heatmaps, how to quickly create forms and tie form data into the backend, cryptocurrency transactions, and how web sockets work.

## What's next for ConnectUKR
We desire to implement features where the app would provide localized newsfeeds, allow users to live streams through their phones, and integrate with external services. In addition to adding extra features, we hope to redesign the UI to make the user experience more enjoyable. But before implementing those features, we should conduct rigorous quality assurance testing to ensure that our web application works as intended.