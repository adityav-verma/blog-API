module.exports = {
//basic objects formats
	register : {
		"username": "user name of the user",
		"email": "email of the user",
		"password": "password of the user"
	},

	login : {
		"username": "user name of the user",
		"password": "password of the user"
	},

	logout : {
		"token": "authentication token"
	},

	blog : {
		"token": "token of the loggedIn user",
		"user_id": "user id for the logged in user",
		"category_id": "id of the category",
		"blog_title": "title",
		"blog_body": "body of the blog"
	},

	category : {
		"category_name": "Name of the category",
		"category_details": "Details of the category"
	},

	authToken : {
		"TOKEN": "Send token in the header for the request"
	}
};
