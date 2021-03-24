import {
  getUsers, setLoggedInUser, logoutUser, loginUser, registerUser,
  getPosts, usePostCollection, getLoggedInUser, createPost, deletePost,
  updatePost, getSinglePost, getUsersPosts
} from "./data/DataManager.js"

import { PostList } from "./feed/PostList.js"
// import {  pugHugList } from "./feed/PostList.js"
import { NavBar } from "./Nav/NavBar.js"
import { Footer } from "./Nav/Footer.js"
import { PostEntry } from "./feed/PostEntry.js"
import { PostEdit } from "./feed/PostEdit.js"
import { RegisterForm } from "./auth/RegisterForm.js"
import { LoginForm } from "./auth/LoginForm.js"
/**
 * Main logic module for what should happen on initial page load for Giffygram
 */

//Get a reference to the location on the DOM where the app will display
// const postElement = document.querySelector(".postList");
// const navElement = document.querySelector("nav");
// const entryElement = document.querySelector(".entryForm")


const showPostList = () => {
  const postElement = document.querySelector(".postList");
  getPosts().then((allPosts) => {
    postElement.innerHTML = PostList(allPosts);
  })
}
// const showPugHugList = () => {
//   const postElement = document.querySelector(".postList");
//   getPosts().then((allPosts) => {
//     postElement.innerHTML = pugHugList(allPosts);
//   })
// }

const showUsersPosts = () => {
  const postElement = document.querySelector(".postList");
  getUsersPosts().then((allPosts) => {
    postElement.innerHTML = PostList(allPosts)
  })
}

const showNavBar = () => {
  //Get a reference to the location on the DOM where the nav will display
  const navElement = document.querySelector("nav");
  navElement.innerHTML = NavBar();
}

const showFooter = () => {
  const footerElement = document.querySelector("footer");
  footerElement.innerHTML = Footer();
}

const showPostEntry = () => {
  //Get a reference to the location on the DOM where the nav will display
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEntry();
}



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

const showLoginRegister = () => {
  showNavBar();
  const entryElement = document.querySelector(".entryForm");
  //template strings can be used here too
  entryElement.innerHTML = `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
  //make sure the post list is cleared out too
  const postElement = document.querySelector(".postList");
  postElement.innerHTML = "";
}

/*
    This function performs one, specific task.

    1. Can you explain what that task is?
    2. Are you defining the function here or invoking it?
*/
const startGiffyGram = () => {

  showPostList();
  showNavBar();
  showFooter();
  showPostEntry();


};
// Are you defining the function here or invoking it?
// startGiffyGram();
checkForUser();

const applicationElement = document.querySelector(".giffygram");

applicationElement.addEventListener("click", event => {
  if (event.target.id === "logout") {
    logoutUser();
    console.log(getLoggedInUser());
    sessionStorage.clear();
    checkForUser();
  }
})

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



applicationElement.addEventListener("change", event => {
  if (event.target.id === "yearSelection") {
    const yearAsNumber = parseInt(event.target.value)

    console.log(`User wants to see posts since ${yearAsNumber}`)
    // invoke a filter function passing the year as an argument
    showFilteredPosts(yearAsNumber);
  }
})

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


applicationElement.addEventListener("click", event => {
  if (event.target.id === "newPost__cancel") {
    
    //clear the input fields
  }
})

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

applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("filter")) {
    getUsersPosts()
      .then(response => {
        showUsersPosts(response);
      })
  }
})

applicationElement.addEventListener("click", event => {
  event.preventDefault();
  if (event.target.id.startsWith("allPosts")) {
    getPosts()
      .then(response => {
        showPostList(response);
      })
  }
})

// applicationElement.addEventListener("click", event => {
//   event.preventDefault();
//   if (event.target.id.startsWith("Pug Hug")) {
//     const postId = event.target.id.split("__")[1];
//     getPosts(postId)
// console.log(postId);
//       .then(response => {
//         showPugHugList(response);
//       })
//   }
// })




// Once the post is returned, we can invoke a function to display a single post.
const showEdit = (postObj) => {
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEdit(postObj);
}


// Add the eventListener for when the update button is clicked.
//  This combines MANY of the concepts we have covered.

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





