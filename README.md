# Backend_social
 
 This contains backend for mini social media where a user can login/register and follow/unfollow other users, Add/delete posts such as images,contents, start a conversation with another users and send messages.
 
 #Authentication , Register/Login/Logout
 
 - User can register with required fields where it checks for validation if email is entered properly.
 - It also validates if given username/ email already exists.
 - Refresh token for authentication is provided.
 - A user is authenticated while hitting some routes if the user is logged in or not.
 - A user can logout and cookies will be deleted.
 
 #Forgot-Password
 
 - Forgot-Password is implemented where a user can reset the password by sending an email to the user.
 - For development stage,have made use of fake email sender.
 - user will get an email with reset password link.
 
 
 #USER, #ADD/DELETE POST, #FOLLOW/UNFOLLOW, #CHAT
 
 - User can update the user profile,the route is authenticated whenever its requested.
 - Can Add/delete post such as images,contents.
 - Can follow/unfollow other users.
 - Can send messages to other users.
 
