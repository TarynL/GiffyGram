export const Post = (postObject) => {
    return `
      <section class="post">
        <header>
            <h2 class="post__title">${postObject.title}</h2>
        </header>
        <img class="post__image" src="${postObject.imageURL}" alt="${postObject.description}"/>
        <h3 class="post_description"
        <div><button id="Pug Hug--${postObject.id}">Pug Hug Here</button></div>
        <button id="delete__${postObject.id}">Delete</button>
      </section>
    `
  }

  