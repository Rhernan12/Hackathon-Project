# Welcome to your Expo app 👋

## Get started

1. Setup frontend:

   ```bash
   cd ./frontend
   ```

   ```bash
   npm install
   ```

2. To test app on the phone:

   (Still in the frontend folder)

   Install Expo Go app from App Store or Play Store

   If the phone and the computer are on the same network:

   ```bash
   npx expo start
   ```

   Then scan the QR code.

   If on different network:

   Create an account at https://ngrok.com/

   ```bash
   ngrok config add-authtoken <YOUR_TOKEN>
   ```

   ```bash
   npx expo start --tunnel
   ```

3. Start backend server:

   ```bash
   cd ../backend
   ```

   TODO: Update instructions for server setup.
