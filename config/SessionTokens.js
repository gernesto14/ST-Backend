import supertokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import EmailVerification from "supertokens-node/recipe/emailverification";
import SessionNode from "supertokens-node/recipe/session";
import UserMetadata from "supertokens-node/recipe/usermetadata";

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
      EmailPassword.init(),
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
