import supertokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import EmailVerification from "supertokens-node/recipe/emailverification";
import SessionNode from "supertokens-node/recipe/session";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import { updateMetadata, validateFormFields } from "../lib/signUp.js";
import { deleteAllUnverifiedUsers } from "../lib/misc.js";

export const initSuperTokens = () => {
  supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI: `${process.env.SUPERTOKENS_CONNECTION_URI}`,
      apiKey: `${process.env.API_KEY}`, // OR can be undefined
    },
    appInfo: {
      appName: "My Frontend",
      apiDomain: `${process.env.SUPERTOKENS_API_DOMAIN}`,
      websiteDomain: `${process.env.SUPERTOKENS_WEBSITE_DOMAIN}`,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init({
        signUpFeature: {
          formFields: [
            {
              id: "first_name",
            },
            {
              id: "last_name",
            },
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                if (originalImplementation.signUpPOST === undefined) {
                  throw Error("Should never come here");
                }

                // Extract the form fields from the input object
                const validatedFormFields = validateFormFields(
                  input.formFields
                );

                // If the form fields are invalid, throw an error and stop the sign-up process
                if (!validatedFormFields) {
                  throw new Error("Invalid form fields");
                }

                // First we call the original implementation of signUpPOST.
                const response = await originalImplementation.signUpPOST(input);

                const userId = response.user.id;

                // Post sign up response, we check if it was successful
                if (response.status === "OK") {
                  // These are the input form fields values that the user used while signing up

                  // Update user metadata
                  await updateMetadata(userId, validatedFormFields);
                }
                return response;
              },
            };
          },
        },
      }),
      Session.init({
        cookieSecure: true, // Only secure cookies in production
        cookieSameSite: "strict", // Optionally set the SameSite policy (could be Strict, Lax, or None)
      }),
      Dashboard.init({
        admins: [`${process.env.SUPERTOKENS_ADMIN_EMAILS}`],
      }),
      UserRoles.init(),
      EmailVerification.init({
        mode: "OPTIONAL", // "REQUIRED", // or "OPTIONAL"
      }),
      UserMetadata.init(),
    ],
  });
};
