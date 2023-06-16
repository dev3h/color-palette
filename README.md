# Dev3h Color Palette API

A simple RESTful API for generating color palettes for your projects.

[1 API Route](#1-api-route)

- [1.1 user routes](#11-user-routes)
- [1.2 color tag routes](#12-color-tag-routes)
- [1.3 collection tag routes](#13-collection-tag-routes)
- [1.4 collection tag routes](#14-collection-tag-routes)

[2 Usage](#2-usage)

## 1 API Route

### 1.1 user routes

| Route                   | HTTP Verb |                                                      Description |
| ----------------------- | :-------: | ---------------------------------------------------------------: |
| **user/register**       |   POST    |                                           Register a new account |
| **user/login**          |   POST    |                                    Login with email and password |
| **user/current**        |    GET    |                   Get information of the current user when login |
| **user/refreshtoken**   |   POST    |          Create new access token using an existing refresh token |
| **user/logout**         |    GET    |                                           Logout from the system |
| **user/forgotpassword** |    GET    |                                   Send email to recover password |
| **user/resetpassword**  |    PUT    |                         Reset password for the forgotten account |
| **/user/**              |    GET    |                         Get a list of all users (for admin only) |
| **/user/current**       |    PUT    |        Update the current user's profile, including their avatar |
| **/user/:id**           |    PUT    | Update a user's profile, including their avatar (for admin only) |
| **/user/:id**           |  DELETE   |                         Delete a user's account (for admin only) |

### 1.2 color tag routes

| Route             | HTTP Verb |                         Description |
| ----------------- | :-------: | ----------------------------------: |
| **/colortag/**    |   POST    |              Create a new color tag |
| **/colortag/**    |    GET    |        Get a list of all color tags |
| **/colortag/:id** |    GET    | Get details of a specific color tag |
| **/colortag/:id** |    PUT    |    Update a color tag's information |
| **/colortag/:id** |  DELETE   |                  Delete a color tag |

### 1.3 collection tag routes

| Route                  | HTTP Verb |                              Description |
| ---------------------- | :-------: | ---------------------------------------: |
| **/collectiontag/**    |   POST    |              Create a new collection tag |
| **/collectiontag/**    |    GET    |        Get a list of all collection tags |
| **/collectiontag/:id** |    GET    | Get details of a specific collection tag |
| **/collectiontag/:id** |    PUT    |    Update a collection tag's information |
| **/collectiontag/:id** |  DELETE   |                  Delete a collection tag |

### 1.4 collection tag routes

| Route                | HTTP Verb |                                        Description |
| -------------------- | :-------: | -------------------------------------------------: |
| **/palette/**        |   POST    |                               Create a new palette |
| **/palette/**        |    GET    |                         Get a list of all palettes |
| **/palette/:id**     |    GET    |                  Get details of a specific palette |
| **/palette/:id**     |    PUT    |                     Update a palette's information |
| **/palette/:id**     |  DELETE   |                                   Delete a palette |
| **/palette/like:id** |    PUT    | Toggle a user's "like" status on a specific palett |

## 2 Usage

1. Clone the repository: `git clone https://github.com/dev3h/dev3h-color-palette-API.git`
2. Install the dependencies: `npm install`
3. Run the app: `npm run dev`
4. The API will be available at: `http://localhost:5000/api/v1`
