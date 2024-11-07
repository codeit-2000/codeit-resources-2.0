import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes: [
          "email",
          "profile",
          "openid",
          "https://www.googleapis.com/auth/calendar",
        ],
      },
      callbackUrls: [
        "http://localhost:3000/",
        "https://main.d1wvfrf8z4vvph.amplifyapp.com/",
      ],
      logoutUrls: [
        "http://localhost:3000/sign-in",
        "https://main.d1wvfrf8z4vvph.amplifyapp.com/sign-in",
      ],
    },
  },
  groups: ["ADMIN", "MEMBER"],
});
