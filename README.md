# Podify - An App to Always Remember your Podcasts.

Podify is a mobile application that is created to help individuals better remember
information that they hear while listening to podcasts. Podcast listeners often face the harsh
reality of struggling to remember the content that they have just spent the last hour listening to.
Podify enables its users to automatically be notified when they begin listening to a podcast and
gives them a sleek and effective platform to store notes on their thoughts regarding their favorite
podcasts. Podify also enables its users to see what other users are listening to, and even see what
others are thinking about certain podcasts. Podify uses Spotify as the podcast listening platform
that the users must connect to give it access to the user’s podcast listening information. 

##  App Layout and Screens

4.2.1 Registration and Logging In
The first step for any mobile application is to authenticate the user and allow them access to the rest of the application. The login screen allows a user to enter their email and password. If the user enters the correct credentials, they are directed to the home page.

If the user does not have an account, they can select the signup button and are then directed to the signup page. This process looks almost identical to logging in, but on the backend, these functionalities are handled differently. Once the user enters a valid email and password, they are directed to the main page of the application and will automatically remain signed in until they explicitly click the sign-out button.

![image](https://github.com/user-attachments/assets/f03dfaf2-fe29-4933-b45b-daca33a9b72f)

4.2.2 Connecting Spotify
When a user first logs in, there will be no podcasts listed since Podify only adds support to take notes on new podcasts the user listens to. The home page displays a message encouraging the user to start listening to podcasts.

To ensure that the user has their Spotify account linked, they must click on the Spotify button at the bottom of the home page. If the user has not linked their Spotify account, they will see a button labeled "Connect Spotify Account", which opens a web browser allowing them to log in and grant Podify access to their Spotify data. Once this happens, the user is directed back to the home page.

If the user has already connected their Spotify account, they will see a message confirming that Spotify is already linked.

![image](https://github.com/user-attachments/assets/2aedd742-fe45-4b74-8cee-e3e170dfe473)
![image](https://github.com/user-attachments/assets/09ce44ac-db20-4bfc-a77c-d052a035c55d)


4.2.3 Push Notification
When a user begins listening to a podcast, they receive a push notification asking if they would like to take notes on the podcast. If the user clicks on the notification, they are brought to the Podify app, where they can see all the podcasts they have notes for.

![image](https://github.com/user-attachments/assets/34fc56db-2cb6-4d12-81b8-071ba4456ebf)
![image](https://github.com/user-attachments/assets/a13905fd-031c-4554-b578-e6cb99bd9fb2)

4.2.4 Taking a Note
When a user clicks on a podcast note, they are taken to the edit screen for that podcast episode. On this screen, they can:

Choose to make their note public or private
Rate the podcast on a scale of 1 through 5
Edit the text of the note
After editing, the note is automatically saved to the backend when the user navigates away from the page.

![image](https://github.com/user-attachments/assets/f4c0b06b-c2e8-426a-836d-662dcbac7407)


4.2.5 Viewing Community Notes
When the user clicks on the community tab, they are taken to a page displaying a collection of podcasts that other users are listening to, along with their average ratings. The user can also see the podcasts they have listened to as part of this community.

If the user clicks on any podcast, they are directed to a page displaying all public notes left by other users for that podcast. The page shows the rating and a preview of each note. Clicking on a note allows the user to view its full content.

![image](https://github.com/user-attachments/assets/259cf468-af98-444b-ad5f-daf1900948bd)
