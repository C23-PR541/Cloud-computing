# Cloud-computing
We use firebase for authentication and authorization for user logins and we also use the database to store application usage data such as tasks for the calendar and history of the application. We use firebase assisted express to edit the profile.
### Firebase for Authentication,  authorization, and database
1. Create a project in firebase console
2. Save the file and sdk that has been given by firebase
3. Enable the Authentication service and configure the desired authentication providers
4. Apply the code from the user which is required for user login authentication.
5. Test the authentication to ensure they function as intended.
6. To store data from users, enable realtime database and storage.
7. Monitor and manage authentication and user data through the Firebase console or API.


#### Login 
Sample request
`curl 'https://gymguru.firebaseio.com/users.json'](https://gymguru-default-rtdb.asia-southeast1.firebasedatabase.app/user.json`

Sample Respone
`{
email:"testaccount5@gmail.com"
name:"Kevin Ariel"
}`
