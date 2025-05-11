# Secret Sprinkles

Secret Sprinkles is a web platform where users can create accounts, receive a public URL to share with others, and collect anonymous messages. The platform enhances user experience with AI-powered message suggestions and provides a dashboard for users to view and manage their messages. Built with Next.js, Secret Sprinkles offers secure authentication, email verification, and a responsive, themeable UI, making it easy to send and receive anonymous feedback or messages.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Accounts and Public URLs**: Create an account to get a unique public URL for receiving anonymous messages.
- **Anonymous Messaging**: Allow anyone to send messages via your public URL without revealing their identity.
- **AI-Powered Suggestions**: Generate creative message ideas using OpenAI’s GPT-3.5-turbo model.
- **User Dashboard**: View, accept, toggle, or delete messages with a clean, interactive interface.
- **Secure Authentication**: Sign up, sign in, and reset passwords with NextAuth, Zod validation, and bcrypt hashing.
- **Email Verification**: Receive personalized OTP emails for account verification and password resets using Resend.
- **Responsive UI**: Enjoy a modern, accessible interface with shadcn/ui, DaisyUI, and a theme switcher for light/dark modes.
- **MongoDB Integration**: Store user data and messages securely with Mongoose schemas.
- **API Endpoints**: Robust APIs for message management, user settings, and AI-driven features.
- **Error Handling and UX**: Improved loading states, spinners, and toast notifications for a seamless experience.

## Technologies

- **Frontend**: Next.js 15.2.4, React, shadcn/ui, DaisyUI, Radix UI, next-themes
- **Backend**: Next.js API Routes, Mongoose, MongoDB
- **Authentication**: NextAuth.js, bcryptjs
- **Validation**: Zod
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Email**: Resend API with React email templates
- **Utilities**: react-hook-form, dayjs, TypeScript

## Installation

To set up Secret Sprinkles locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/panderonak/secret-sprinkles.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd secret-sprinkles
   ```

3. **Install Dependencies**:

   ```bash
   bun install
   # or
   npm install
   ```

4. **Set Up Environment Variables**:

   ```bash
   cp .env.sample .env.local
   ```

   Update `.env.local` with the required values:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   RESEND_API_KEY=your_resend_api_key
   NEXTAUTH_SECRET=your_nextauth_secret
   OPENAI_API_KEY=your_openai_api_key
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Run the Development Server**:

   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Access the Application**:

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. **Sign Up**: Create an account with a username, email, and password. Verify your email using the OTP sent via Resend.
2. **Get Your Public URL**: After signing in, access your dashboard to find your unique public URL.
3. **Share Your URL**: Share the URL with others to receive anonymous messages.
4. **View Messages**: Use the dashboard to view, accept, or delete messages. Toggle message acceptance settings as needed.
5. **Use AI Suggestions**: When sending messages via a public URL, leverage AI-powered suggestions to craft creative content.

## Configuration

Secret Sprinkles requires the following environment variables in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/secret-sprinkles
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_nextauth_secret
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Routes

Refer to the source code in `/src/app/api` for detailed endpoint specifications.

## Contributing

We welcome contributions to Secret Sprinkles! To contribute:

1. Fork the repository.
2. Create a feature or bugfix branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature X"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request with a detailed description.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, feedback, or support, please:

- Open an issue on GitHub: [https://github.com/panderonak/secret-sprinkles/issues](https://github.com/panderonak/secret-sprinkles/issues)
- Contact the maintainer: _[Your preferred contact method]_
