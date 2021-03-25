import {
  getUsers, setLoggedInUser, logoutUser, loginUser, registerUser,
  getPosts, usePostCollection, getLoggedInUser, createPost, deletePost,
  updatePost, getSinglePost, getUsersPosts, postLike
} from "./data/DataManager.js"

import { PostList } from "./feed/PostList.js"
import {  pugHugDeets } from "./feed/Post.js"
import { NavBar } from "./Nav/NavBar.js"
import { Footer } from "./Nav/Footer.js"
import { PostEntry } from "./feed/PostEntry.js"
import { PostEdit } from "./feed/PostEdit.js"
import { RegisterForm } from "./auth/RegisterForm.js"
import { LoginForm } from "./auth/LoginForm.js"


// Post function to reference dom where post will display 
const showPostList = () => {
  const postElement = document.querySelector(".postList");
  getPosts().then((allPosts) => {
    postElement.innerHTML = PostList(allPosts);
  })
}


// Users function to reference dom where they will display 
const showUsersPosts = () => {
  const postElement = document.querySelector(".postList");
  getUsersPosts().then((allPosts) => {
    postElement.innerHTML = PostList(allPosts)
  })
}


// Nav function to reference dom where nav will display 
const showNavBar = () => {
  //Get a reference to the location on the DOM where the nav will display
  const navElement = document.querySelector("nav");
  navElement.innerHTML = NavBar();
}


// Footer function to reference dom where footer will display 
const showFooter = () => {
  const footerElement = document.querySelector("footer");
  footerElement.innerHTML = Footer();
}


//Entry function to reference dom where entries will display
const showPostEntry = () => {
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEntry();
}


// login function 
const checkForUser = () => {
  if (sessionStorage.getItem("user")) {
    //this is expecting an object. Need to fix
    // sessionstorage only takes a string. json parse will convert the object into a string
    setLoggedInUser(JSON.parse(sessionStorage.getItem("user")));
    startGiffyGram();
  } else {
    //show login/register
    showLoginRegister();
  }
}
// register user function 
const showLoginRegister = () => {
  showNavBar();
  const entryElement = document.querySelector(".entryForm");
  //template strings can be used here too
  entryElement.innerHTML = `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
  //make sure the post list is cleared out too
  const postElement = document.querySelector(".postList");
  postElement.innerHTML = "";
}


const startGiffyGram = () => {

  showPostList();
  showNavBar();
  showFooter();
  showPostEntry();
}

checkForUser();

const applicationElement = document.querySelector(".giffygram");

// logout user 
applicationElement.addEventListener("click", event => {
  if (event.target.id === "logout") {
    logoutUser();
    console.log(getLoggedInUser());
    sessionStorage.clear();
    checkForUser();
  }
})


// login user 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id === "login__submit") {
    //collect all the details into an object
    const userObject = {
      name: document.querySelector("input[name='name']").value,
      email: document.querySelector("input[name='email']").value
    }
    loginUser(userObject)
      .then(dbUserObj => {
        if (dbUserObj) {
          sessionStorage.setItem("user", JSON.stringify(dbUserObj));
          startGiffyGram();
        } else {
          //got a false value - no user
          const entryElement = document.querySelector(".entryForm");
          entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
        }
      })
  }
})


// register new user 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id === "register__submit") {
    //collect all the details into an object
    const userObject = {
      name: document.querySelector("input[name='registerName']").value,
      email: document.querySelector("input[name='registerEmail']").value
    }
    registerUser(userObject)
      .then(dbUserObj => {
        sessionStorage.setItem("user", JSON.stringify(dbUserObj));
        startGiffyGram();
      })
  }
})


// filter post by date 
applicationElement.addEventListener("change", event => {
  if (event.target.id === "yearSelection") {
    const yearAsNumber = parseInt(event.target.value)

    console.log(`User wants to see posts since ${yearAsNumber}`)
    // invoke a filter function passing the year as an argument
    showFilteredPosts(yearAsNumber);
  }
})


// Filter post by date 
const showFilteredPosts = (year) => {
  //get a copy of the post collection
  const epoch = Date.parse(`01/01/${year}`);
  //filter the data
  const filteredData = usePostCollection().filter(singlePost => {
    if (singlePost.timestamp >= epoch) {
      return singlePost
    }
  })

  const postElement = document.querySelector(".postList");
  postElement.innerHTML = PostList(filteredData);
}

// Cancel Post 
applicationElement.addEventListener("click", event => {
  if (event.target.id === "newPost__cancel") {
    showPostEntry();
    //clear the input fields
  }
})

// Submit Post 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id === "newPost__submit") {
    //collect the input values into an object to post to the DB
    const title = document.querySelector("input[name='postTitle']").value
    const url = document.querySelector("input[name='postURL']").value
    const description = document.querySelector("textarea[name='postDescription']").value
    //we have not created a user yet - for now, we will hard code `1`.
    //we can add the current time as well
    const postObject = {
      title: title,
      imageURL: url,
      description: description,
      userId: getLoggedInUser().id,
      timestamp: Date.now()
    }
showPostEntry();
    // be sure to import from the DataManager
    createPost(postObject)
      .then(response => {
        showPostList();
      })
  }

})

// delete button 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("delete")) {
    const postId = event.target.id.split("__")[1];

    deletePost(postId)
      .then(response => {
        showPostList();
      })
  }
})

// add an eventListener to handle when the edit button is clicked.
//  We can use the string method startsWith to target the id of the edit button.

// We can get the id of the item using the string method split 
// which splits a string into an array of substrings, and returns the new array.

// Edit button 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("edit")) {
    const postId = event.target.id.split("__")[1];
    getSinglePost(postId)
      .then(response => {
        showEdit(response);
      })
  }
})

// Once the post is returned, we can invoke a function to display a single post.
const showEdit = (postObj) => {
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEdit(postObj);
}

// Filter posts by Users 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("filter")) {
    getUsersPosts()
      .then(response => {
        showUsersPosts(response);
      })
  }
})


// See all posts event listener 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("allPosts")) {
    getPosts()
      .then(response => {
        showPostList(response);
      })
  }
})


// Update Button 
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("updatePost")) {
    const postId = event.target.id.split("__")[1];
    //collect all the details into an object
    const title = document.querySelector("input[name='postTitle']").value
    const url = document.querySelector("input[name='postURL']").value
    const description = document.querySelector("textarea[name='postDescription']").value
    const timestamp = document.querySelector("input[name='postTime']").value

    const postObject = {
      title: title,
      imageURL: url,
      description: description,
      userId: getLoggedInUser().id,
      timestamp: parseInt(timestamp),
      id: parseInt(postId)
    }
    // place before response so form can't be submitted multiple times 
    showPostEntry();

    updatePost(postObject)
      .then(response => {
        showPostList();
      })
  }

})

// Details button
applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("pugHug")) {
   
    const postId = event.target.id.split("__")[1];
    console.log(event.target.id)
    getSinglePost(postId)
    
      .then(response => {
        pugHugDeets(response);
      })
  }
}
)

// Like button
applicationElement.addEventListener("click", event => {
	event.preventDefault();
	if (event.target.id.startsWith("like")) {
	  const likeObject = {
		 postId: parseInt(event.target.id.split("__")[1]),
		 userId: getLoggedInUser().id
	  }
	  postLike(likeObject)
		.then(response => {
		  showPostList();
		})
	}
  })

  