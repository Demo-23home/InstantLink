# InstantLink

![InstantLink Logo](/InstantLink.png)

## Overview

InstantLink is a modern chat application built using Django Rest Framework (DRF) for the backend and React Native for the Mobile. The app supports real-time communication using WebSockets, allowing for instant messaging between users. Key features include user authentication, friend requests, real-time messaging, and message pagination.

## Features

- **User Authentication**: Sign up, sign in, and secure credential storage.
- **Friend Management**: Send, receive, and accept friend requests.
- **Real-Time Messaging**: Send and receive messages in real-time using WebSockets.
- **Message Pagination**: Efficiently paginate through messages.
- **WebSockets Integration**: Real-time updates and notifications.
- **Profile Management**: Update user profiles and manage profile pictures.

## Technologies Used

- **Backend**: Django, Django Rest Framework, Django Channels, Redis
- **Frontend**: React Native
- **Real-Time Communication**: WebSockets (Django Channels, Daphne)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Jazzmin for Django admin customization, Zustand for global state management in React Native

## Installation

### Prerequisites

- Python 3.10 or higher
- Node.js and npm

### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Demo-23home/RealTimeChatinngApp-DRF-ReactNative.git
    cd RealTimeChattingApp-DRF-ReactNative
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Navigate to the `backend` directory:
    ```bash
    cd api
    ```

5. Run migrations:
    ```bash
    python manage.py migrate
    ```

6. Create a superuser:
    ```bash
    python manage.py createsuperuser
    ```

7. Start the Django development server:
    ```bash
    python manage.py runserver
    ```

### Mobile Setup

1. Navigate to the `frontend` directory:
    ```bash
    cd app
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Run the React Native app:
    ```bash
    npm start
    ```

## Contributing

Contributions are welcome! If you have ideas for improvements or have found bugs, please follow the steps below to contribute to the project.

### Steps to Contribute

1. **Fork the repository**: Click the "Fork" button at the top right corner of this repository to create a copy of the repository on your GitHub account.

2. **Clone your fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/Demo-23home/RealTimeChatinngApp-DRF-ReactNative.git
    cd RealTimeChattingApp-DRF-ReactNative
    ```

3. **Create a new branch**: Create a new branch for your feature or bug fix.
    ```bash
    git checkout -b feature-branch
    ```

4. **Make your changes**: Make your changes to the codebase.

5. **Commit your changes**: Commit your changes with a clear and descriptive commit message.
    ```bash
    git commit -m 'Add some feature'
    ```

6. **Push to the branch**: Push your changes to the branch on your forked repository.
    ```bash
    git push origin feature-branch
    ```

7. **Open a pull request**: Go to the original repository on GitHub and open a pull request to the `main` branch. Provide a clear description of the changes and any relevant information.

8. **Review process**: Your pull request will be reviewed by the project maintainers. Be prepared to make any necessary changes based on feedback.

Thank you for contributing to the RealTimeChattingApp project!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.


