# My Portfolio

This is my personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. It showcases my projects, skills, and experience.

![Portfolio Screenshot](<PLACEHOLDER: Add a screenshot of your portfolio here>)

## ✨ Features

-   **Dynamic Content:** Content is managed through a custom admin panel and stored in Firebase.
-   **Internationalization:** Supports multiple languages (English, Spanish, French, Portuguese).
-   **Interactive 3D animations:** Using React Three Fiber and Drei.
-   **Responsive Design:** Fully responsive and works on all devices.

## 🛠️ Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
-   **Internationalization:** [i18next](https://www.i18next.com/)
-   **Database:** [Firebase](https://firebase.google.com/)
-   **Linting:** [ESLint](https://eslint.org/)
-   **Testing:** [Jest](https://jestjs.io/)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v20 or higher)
-   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/<YOUR_GITHUB_USERNAME>/portfolio.git
    cd portfolio
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

This project requires some environment variables to be set. Create a `.env.local` file in the root of the project and add the following variables. You can refer to `.env.example` for a template.

```
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```
*Note: The `FIREBASE_PRIVATE_KEY` needs to be Base64 encoded.*

### Firebase Firestore Rules

For the website to function correctly, you need to set up security rules in Firestore to allow public read access while restricting write access to administrators.

Go to your **Firebase Console -> Firestore Database -> Rules** and paste the following rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Only you can write
    function isAdmin() {
      // Important: Replace "YOUR_UUID" with your actual Firebase User ID.
      // You can find your UID in the Firebase Console under Authentication -> Users.
      return request.auth != null &&
             request.auth.uid == "YOUR_UUID";
    }

    match /{document=**} {

      // Public Read for all documents
      allow read: if true;

      // Write restricted to Admin
      allow write: if isAdmin();
    }
  }
}
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## ✅ Running Tests

To run the tests, use the following command:

```bash
npm run test
```

## Linter

To run the linter, use the following command:

```bash
npm run lint
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the MIT License.