# **InkStone**

![Screenshots of InkStone's homepage](readme/mockup.png)

Link to demo : [InkStone](https://inkstone-react.netlify.app/)

#### Test Accounts:

-   Admin Panel at [InkStone Express](https://inkstone-express.herokuapp.com/accounts/login)

    -   Username: admin
    -   Password: admin

-   React Frontend at [InkStone React](https://inkstone-react.netlify.app/)
    -   Username: customer
    -   Password: rotiprata123

## Summary

InkStone is an e-commerce web application for fountain pens. This e-commerce web application serves as a platform for customers to browse and purchase fountain pens based on fountain pen specifications.

---

## UI/UX

### Strategy

#### Organisational Goals

#### User Goals

| User Stories | Accceptance Criteria |
| ------------ | -------------------- |

### Structure and Skeleton

#### Database

![ERD Diagram](readme/erd.png)

Entity-Relationship Diagram (ERD) is drawn to demostrate the various relationships between entities for the website prior to modelling the database in MySQL.

![Logical Schema](readme/logical_schema.png)

Logical schema is then drawn based on the ERD diagram.

An Express server is then set up and deployed to [Heroku](https://www.heroku.com/), where API endpoints are accessible via the base URL at [https://inkstone-express.herokuapp.com/api/](https://inkstone-express.herokuapp.com/api/).

#### Sitemap

![InkStone Express Sitemap](readme/admin-sitemap.png)

![InkStone React Sitemap](readme/react-sitemap.png)

#### Wireframes

[Wireframes]()

### Design Decisions

#### Color scheme

![Screenshot of color scheme](readme/color-scheme.png)

The color scheme chosen revolves around a dark-green primary color and gold accent color to emphasize the theme of luxury and elegance.

#### Fonts

*Eagle Lake* is the font family used for the brand as it resembles the handwritten cursive font that can be achieved using a fountain pen. The serif font also serves to represent the idea of luxury and elegance that the website is aiming to achieve.

*Work Sans* is the font family used for the texts in the website as it maintains great readability whether used at small or large sizes. It is also chosen because of its compatibility with the *Eagle Lake* font family.

---

## Features

| Features | Description |
| -------- | ----------- |

---

## Limitations and Future Implementations

---

## Technologies Used

### Backend

1. Javascript

2. [Express](https://expressjs.com/)

3. [cors](https://www.npmjs.com/package/cors)

    - Middleware to enable Cross-Origin Resource Sharing (CORS)

4. [dotenv](https://www.npmjs.com/package/dotenv)
    - To allow loading of environment variables from .env file

### Frontend

1. HTML

2. CSS

3. Javascript

4. [React](https://reactjs.org/)

5. [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/)

    - Used for styling website

6. [React Bootstrap](https://react-bootstrap.github.io/)

    - Used for styling website

7. [Axios](https://github.com/axios/axios)

    - Used to communicate with Express server to create, read, update and delete data in database

8. [Font Awesome](https://fontawesome.com/)
    - Used for icons displayed in website

---

## Testing

The website is tested for responsiveness using Developer Tools on Chrome browser for mobile, tablet and desktop screen widths.
The test cases can be found [here]().

---

## Deployment

### Frontend

The website is hosted using [Netlify](https://www.netlify.com/), deployed directly from the main branch of this Github repository.
For the detailed deployment steps, you can refer to the blog post on Netlify [here](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/).

### Backend

The Express server is hosted using [Heroku](https://www.heroku.com/), deployed directly from the main branch of the Github repository [here]().
For the detailed deployment steps, you can refer to the documentation on Heroku [here](https://devcenter.heroku.com/articles/git#deploy-your-code).

---

## Credits and Acknowledgement

### Logo :

-   [Adobe Express Logo Maker](https://www.adobe.com/express/create/logo) - Used to generate brand logo for website

### Fonts :

-   [Google Fonts](https://fonts.google.com/) - Used for fonts displayed in website

### Icons :

-   [Font Awesome](https://fontawesome.com/) - Used for icons displayed in website

### CSS Spinner :

-   [SpinKit](https://tobiasahlin.com/spinkit/) - Adapted CSS spinner for use in website

### Box Shadows:

-   [CSS Scan](https://getcssscan.com/css-box-shadow-examples) - For box-shadows used to style website

### Images :

-   [Unsplash](https://unsplash.com/) - For coffee images used in website

### Screenshot :

-   [CreateMockup.com](https://www.createmockup.com/generate/) - Used to generate responsive website mockup for README file
