ALL REACT ROUTES ARE IN APP.JS

React Route for: /groups

This view contains:

Button: Sign Out (leads to route: /signout)

Axios POST call to: https://bailfire.herokuapp.com/auth/signout or http://localhost:8080/auth/signout

POST Error prompts the user

POST Success leads to route: /

Button: Create New Group (leads to route: /create/group)

Heading for Your Groups

Vertical List of Rows containing Buttons for each Group:

Group Name (leads to route: /view/group/:id)

Modify (leads to route: /modify/group/:id)

Remove (leads to route: /remove/group/:id)