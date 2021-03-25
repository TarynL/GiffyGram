import { getLoggedInUser, getLikes } from "../data/DataManager.js"

export const getNumberOfLikes = (postId) => {
  getLikes(postId)
  .then(response => {
    document.querySelector(`#likes__${postId}`).innerHTML = `👍 ${response.length}`;
  })
}

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
      
        
        <div class ="buttons">
        <div id="likes__${postObject.id}">👍 ${getNumberOfLikes(postObject.id)}</div>
        <button class="buttons" id="like__${postObject.id}">Like</button>
        <div><button class="buttons" id="delete__${postObject.id}">Delete</button></div>
        <button class="buttons" id="edit__${postObject.id}">Edit</button>
        <button class="buttons" id="pugHug__${postObject.id}">Pug Hug Here</button></div>
        
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
        
        
        <div class ="buttons">
        <div id="likes__${postObject.id}">👍 ${getNumberOfLikes(postObject.id)}</div>
        <button  id="like__${postObject.id}">Like</button>
        <button  id="pugHug__${postObject.id}">Pug Hug Here</button></div>  
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
