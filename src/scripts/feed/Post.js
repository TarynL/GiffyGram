import { getLoggedInUser } from "../data/DataManager.js"

export const Post = (postObject) => {
  let loggedInUser = getLoggedInUser();
  if (postObject.userId === loggedInUser.id) {
    return `

      <section class="post">
        <header>
            <h2 class="post__title">${postObject.title}</h2>
        </header>
        <img class="post__image" src="${postObject.imageURL}" alt="${postObject.description}"/>
        <h6 class="details__${postObject.id}"></h6>
        <h4 class="userName">Posted by ${postObject.user.name}</h4>
        

        <div><button id="delete__${postObject.id}">Delete</button></div>
        <button id="edit__${postObject.id}">Edit</button>
        <div><button id="Pug Hug__${postObject.id}">Pug Hug Here</button></div>
        
      </section>
    `
  }
  else {
    return `
      <section class="post">
        <header>
            <h2 class="post__title">${postObject.title}</h2>
        </header>
        <img class="post__image" src="${postObject.imageURL}" alt="${postObject.description}"/>
        <h6 class="details__${postObject.id}"></h6>
        <h4 class="userName">Posted by ${postObject.user.name}</h4>
        
        <div><button type ="hidden" id="Pug Hug__${postObject.id}">Pug Hug Here</button></div>  
      </section>
    `
  }
}

const pugHug = (postObj) => {
  console.log(postObj);
  return `
    
      <h6 class="details__${postObj.id}">${postObj.description}</h6>
      
    `
}

export const pugHugDeets = (post) => {
  console.log(post)
  const pugElement = document.querySelector(`.details__${post.id}`)
  pugElement.innerHTML = pugHug(post);
}
