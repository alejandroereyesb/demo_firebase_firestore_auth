# Demo Firebase Firestore y Authentication

## Funcionalidades Album de Fotos

Esta demo consta de un album de fotos y de dos formularios para la autenticación de usuarios. 

- El botón `Create` permite añadir una foto a nuestra base de datos, introduciendo en el prompt un título y una url de una imagen.

- El botón `Read All` muestra todas las fotos guardadas en nuestra base de datos junto con su título e id 

- El botón `Clear` permite borrar las fotos del DOM. No elimina de la base de datos.

- El botón `Find One by Id` muestra la foto correspondiente al Id introducido. 

- El botón `Delete` permite borrar la foto especificada de la base de datos.

- El botón `Show favorites` permite visualizar los favoritos del usuario logado en el sistema

- Los usuarios autenticados pueden ver el botón `Add favorite`, que permite añadir a favoritos el elemento seleccionado

- Los usuarios autenticados pueden ver el botón `Delete favorite`, que permite eliminar un favorito de su lista al pulsarlo


## Funcionalidades Authentication

**Formulario de registro** guarda un usuario en Firestore y en Authentication.

**Formulario de Login** permite hacer sign in de un usuario. Muestra la credencial por consola.

**Logout** realiza el logout del usuario, eliminando la credencial. 

Existe un escuchador de eventos para manejar persistencia del login, es decir que el usuario peramenecerá logado aunque se cierre la pestaña hasta que haga logout.

## Crear proyecto Firebase

1. Ir a [Firebase](https://firebase.google.com/)

2. Crear proyecto en firebase
    - Introducir nombre de tu app i.e. demo
    - Deshabilitar Google Analytics
    - Crear proyecto

3. En el dashboard de Firebase ir a _Project Settings_
    - En la pestaña General, añadir una dirección de correo en Support Email 
    - Hacer scroll para abajo y hacer click en el símbolo &lt;/&gt;. 
        - Introducir nombre i.e. demo
        - No habilitar Firebase Hosting
        - click en Register app/Registrar app
        por el momento no necesitamos el código que aparece --> click en _Continue to console/Continuar a Consola_

## Habilitar Firestore en Firebase

1. Ir a la consola de [Firebase](https://firebase.google.com/)
    - En la barra lateral click en menú _Build_
    - Click en _Firestore Database_
    - Click en _Create database/Crear base de datos_
    - Seleccionar _Start in test mode/Comenzar en modo de prueba_
    - Seleccionar la localización del servidor (preferiblemente la localización mas cercana)
    - _Enable_

2. Reglas de seguridad
    En la consola de Firestore, pestaña _rules_ pegar lo siguiente

    ```
    rules_version = '2';
        service cloud.firestore {
            match /databases/{database}/documents {
                match /{document=**} {
                    allow read, write: if true;
                }
            }
        }
    ```

## Habilitar Authentication en Firebase

1. Ir a la consola de [Firebase](https://firebase.google.com/)
    - En la Barra lateral click en el menú _Build_
    - Click en _Authentication_
    - Click en _get started/Comenzar_
    - Seleccionar la forma de autenticación, para nuestro proyecto elegiremos Email/Password
    - Habilitamos _Email/Password_, dejamos deshabilitado Email link [1]
    - Click _Save/Guardar_

[1]: Si tienes instalada la extensión de CORS, asegurate de que esté deshabilitada. 

## Implementar Firebase en nuestro proyecto
1. Obtener el objeto de configuración de Firebase de nuestra app

- Ir a la consola de Firebase
- En la barra lateral hacemos click en _⚙️_ y seleccionamos _Project settings_
- En _Project settings_ hacemos scroll hacia abajo hasta la sección _Your Apps/Tus aps_
- En la sección _SDK setup and configuration_, hacemos click en config.
- Copiamos el objeto FirebaseConfig

2. En nuestro script.js pegamos nuestro objeto _FirebaseConfig_ en la primera linea.








