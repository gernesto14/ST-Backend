import supertokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import EmailVerification from "supertokens-node/recipe/emailverification";
import SessionNode from "supertokens-node/recipe/session";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import { updateMetadata, validateFormFields } from "../lib/signUp.js";
// import { deleteAllUnverifiedUsers } from "../lib/misc.js";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import { validateAccessCode } from "../lib/signUp.js";

export const initSuperTokens = () => {
  const apiDomain = process.env.SUPERTOKENS_API_DOMAIN;
  const websiteDomain = process.env.SUPERTOKENS_WEBSITE_DOMAIN;

  supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI: `${process.env.SUPERTOKENS_CONNECTION_URI}`,
      apiKey: `${process.env.API_KEY}`, // OR can be undefined
    },
    appInfo: {
      appName: "My Frontend",
      apiDomain,
      websiteDomain,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init({
        signUpFeature: {
          formFields: [
            {
              id: "access_code",
            },
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                // Validate the access code
                const accessCode = input.formFields[2].value;
                if (accessCode !== "DEMO") {
                  throw new Error("Invalid access code");
                } else {
                  console.log("Access code is valid");
                }

                // Validate the form fields

                // Set the flag BEFORE calling the original implementation
                input.userContext.signingUp = true;
                const response = await originalImplementation.signUpPOST(input);
                return response;
              },
            };
          },
        },
      }),
      Session.init({
        cookieSecure: true, // Only secure cookies in production
        cookieSameSite: "strict", // Optionally set the SameSite policy (could be Strict, Lax, or None)
        ////////////////////////////////////////////
        //
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              ////////////////////////////////////////////
              // Override the createNewSession function to prevent session creation for signups
              createNewSession: async function (input) {
                if (input.userContext.signingUp) {
                  // console.log("Preventing session creation for signup", input);

                  // Return an empty session
                  return {
                    getAccessToken: () => "",
                    getAccessTokenPayload: () => null,
                    getExpiry: async () => -1,
                    getHandle: () => "",
                    getSessionDataFromDatabase: async () => null,
                    getTimeCreated: async () => -1,
                    getUserId: () => "",
                    revokeSession: async () => {},
                    updateSessionDataInDatabase: async () => {},
                    mergeIntoAccessTokenPayload: async () => {},
                    assertClaims: async () => {},
                    fetchAndSetClaim: async () => {},
                    getClaimValue: async () => undefined,
                    setClaimValue: async () => {},
                    removeClaim: async () => {},
                    attachToRequestResponse: () => {},
                    getAllSessionTokensDangerously: () => ({
                      accessAndFrontTokenUpdated: false,
                      accessToken: "",
                      frontToken: "",
                      antiCsrfToken: undefined,
                      refreshToken: undefined,
                    }),
                    getTenantId: () => "public",
                    getRecipeUserId: () =>
                      SuperTokens.convertToRecipeUserId(""),
                  };
                }
                return originalImplementation.createNewSession(input);
              },
            };
          },
        },
        ////////////////////////////////////////////
      }),
      //
      Dashboard.init({
        admins: [`${process.env.SUPERTOKENS_ADMIN_EMAILS}`],
      }),
      UserRoles.init(),
      EmailVerification.init({
        mode: "REQUIRED", // "REQUIRED", // or "OPTIONAL"
      }),
      UserMetadata.init(),
    ],
  });
};
