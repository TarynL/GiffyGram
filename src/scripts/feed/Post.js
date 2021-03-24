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
        <h6 class="details"></h6>
        <h4 class="userName">Posted by ${postObject.user.name}</h4>
        <h3 class="post_description"

        <div><button id="delete__${postObject.id}">Delete</button></div>
        <button id="edit__${postObject.id}">Edit</button>
        <div><button id="Pug Hug--${postObject.id}">Pug Hug Here</button></div>
        
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
        <h4 class="userName">Posted by ${postObject.user.name}</h4>
        <h3 class="post_description"
        <div><button type ="hidden" id="Pug Hug--${postObject.id}">Pug Hug Here</button></div>  
      </section>
    `
  }
}

// export const pugHug = (postObject) => {
//   return `
    
//       <h6>${postObject.description}</h6>
      
//     `
// }