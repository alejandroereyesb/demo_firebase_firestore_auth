let firebaseConfig = { //objeto de configuración de Firebase

};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

// Create element
const createPicture = (picture) => {
  db.collection("album")
    .add(picture)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id)
      readAll();
    })
    .catch((error) => console.error("Error adding document: ", error));
};

// Read all
const readAll = () => {
  // Limpia el album para mostrar el resultado
  cleanAlbum();

  //Petición a Firestore para leer todos los documentos de la colección album
  db.collection("album")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        printPhoto(doc.data().title, doc.data().url, doc.id)
      });

    })
    .catch(() => console.log('Error reading documents'));;
};

// Delete element
const deletePicture = () => {
  const id = prompt('Introduce el ID a borrar');
  db.collection('album').doc(id).delete().then(() => {
    alert(`Documento ${id} ha sido borrado`);
    //Clean
    document.getElementById('album').innerHTML = "";
    //Read all again
    readAll();
  })
    .catch(() => console.log('Error borrando documento'));
};

// Clean DOM
const cleanAlbum = () => {
  document.getElementById('album').innerHTML = "";
};

// Show on page load
/* readAll(); */


// Print element
const printPhoto = (title, url, docId, isFavorite = false) => {
  let card = document.createElement('article');
  card.setAttribute('class', 'card');
  let picture = document.createElement('img');
  picture.setAttribute('src', url);
  let caption = document.createElement('p');
  caption.innerHTML = title;
  let id = document.createElement('p');
  id.innerHTML = docId;

  const album = document.getElementById('album');
  card.appendChild(picture);
  card.appendChild(caption);
  card.appendChild(id);

  const user = firebase.auth().currentUser;
  if (user) {
    if (!isFavorite) { // Si no es favorito, no se muestra el botón
      let favoriteButton = document.createElement('button');
      favoriteButton.innerText = 'Add Favorite';
      favoriteButton.addEventListener('click', () => addToFavorites(docId, { title, url }));
      card.appendChild(favoriteButton);
    } else {
      let removeButton = document.createElement('button');
      removeButton.innerText = 'Delete favorite';
      removeButton.addEventListener('click', () => removeFromFavorites(docId));
      card.appendChild(removeButton);
    }
  }

  album.appendChild(card);
};


//**********EVENTS**********

// Create
document.getElementById("create").addEventListener("click", () => {
  const title = prompt("Introduce el título de tu foto");
  const url = prompt("Introduce la url de tu foto");
  if (!title || !url) {
    alert("Hay un campo vacio. No se ha salvado");
    return
  }
  createPicture({
    title,
    url,
  });
});

// Read all
document.getElementById("read-all").addEventListener("click", () => {
  readAll();
});

// Read one
document.getElementById('read-one').addEventListener("click", () => {
  const id = prompt("Introduce el id a buscar");
  readOne(id);
});

// Delete one
document.getElementById('delete').addEventListener('click', () => {
  deletePicture();
});

// Clean
document.getElementById('clean').addEventListener('click', () => {
  cleanAlbum();
});

//********FIRESTORE USERS COLLECTION******
// Create user
const createUser = (user) => {
  db.collection("users")
    .doc(user.id) // Usar el UID del usuario como ID del documento en Firestore
    .set({
      email: user.email,
      favorites: [] // Crear array de favoritos vacío
    })
    .then(() => console.log("Usuario creado con ID: ", user.id))
    .catch((error) => console.error("Error creando usuario: ", error));
};

// Read ONE element by ID
function readOne(id) {
  // Limpia el album para mostrar el resultado
  cleanAlbum();

  //Petición a Firestore para leer un documento de la colección album 
  var docRef = db.collection("album").doc(id);

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      printPhoto(doc.data().title, doc.data().url, doc.id);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

}



// Favoritos
// Add favite
const addToFavorites = (photoId, photoData) => {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert('Debes estar logueado para añadir a favoritos.');
    return;
  }

  const userRef = db.collection('users').doc(user.uid);

  userRef.get()
    .then((doc) => {
      if (doc.exists) {
        const favorites = doc.data().favorites;
        const updatedFavorites = [...favorites, { id: photoId, ...photoData }]; // Añadir la foto al array manualmente

        userRef.update({ favorites: updatedFavorites })
          .then(() => {
            alert('Foto añadida a favoritos.');
          });
      } else {
        console.log('No se encontró el usuario.');
      }
    })
    .catch((error) => {
      console.error('Error añadiendo a favoritos: ', error);
    });
    alert('Foto añadida a favoritos.');
};

// Delete favorite
const removeFromFavorites = (photoId) => {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert('Debes estar logueado para borrar favoritos.');
    return;
  }

  const userRef = db.collection('users').doc(user.uid);
  
  userRef.get()
    .then((doc) => {
      if (doc.exists) {
        const favorites = doc.data().favorites;
        const updatedFavorites = favorites.filter(fav => fav.id !== photoId); // Remove the photo by ID

        userRef.update({ favorites: updatedFavorites }) 
          .then(() => {
            alert('Foto eliminada de favoritos.');
            showFavorites(); // Update the favorites view
          });
      } else {
        console.log('No se encontró el usuario.');
      }
    })
    .catch((error) => {
      console.error('Error eliminando de favoritos: ', error);
    });
};

// Print favorites
const showFavorites = () => {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert('Debes estar logueado para ver tus favoritos.');
    return;
  }

  const userRef = db.collection('users').doc(user.uid);

  userRef.get()
    .then((doc) => {
      if (doc.exists) {
        const favorites = doc.data().favorites || [];
        cleanAlbum(); // Limpia el álbum para mostrar los favoritos
        favorites.forEach((favorite) => {
          printPhoto(favorite.title, favorite.url, favorite.id, true); // Pasar isFavorite como true
        });
      } else {
        console.log('No se encontró el usuario.');
      }
    })
    .catch((error) => {
      console.error('Error obteniendo favoritos: ', error);
    });
};

// Evento para el botón "Ver Favoritos"
document.getElementById('show-favorites').addEventListener('click', showFavorites);

/**************Firebase Auth*****************/
// Sign up
const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      alert(`se ha registrado ${user.email} ID:${user.uid}`)
      // ...
      // Saves user in firestore
      createUser({
        id: user.uid,
        email: user.email
      });

    })
    .catch((error) => {
      console.log("Error en el sistema" + error.message, "Error: " + error.code);
    });
};


document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.pass.value;
  let pass2 = event.target.elements.pass2.value;

  pass === pass2 ? signUpUser(email, pass) : alert("error password");
})

// Sign in
const signInUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`)
      alert(`se ha logado ${user.email} ID:${user.uid}`)
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
}

// Sign out user
const signOut = () => {
  let user = firebase.auth().currentUser;

  firebase.auth().signOut().then(() => {
    console.log("Sale del sistema: " + user.email)
  }).catch((error) => {
    console.log("hubo un error: " + error);
  });
}

document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email2.value;
  let pass = event.target.elements.pass3.value;
  signInUser(email, pass)
})
document.getElementById("salir").addEventListener("click", signOut);

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
    document.getElementById("message").innerText = `Está en el sistema: ${user.uid}`;
  } else {
    console.log("no hay usuarios en el sistema");
    document.getElementById("message").innerText = `No hay usuarios en el sistema`;
  }
});