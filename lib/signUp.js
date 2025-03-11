import UserMetadata from "supertokens-node/recipe/usermetadata";
import validator from "validator";

// Validate the form fields and return cleaned form fields as an object.
export function validateFormFields(formFields) {
  // Example formFields:
  //   formFields:  [
  //   { id: 'email', value: 'sckjnssdasc@email.com' },
  //   { id: 'password', value: 'lksndc2389' },
  //   { id: 'first_name', value: 'kjandc' },
  //   { id: 'last_name', value: 'sjndc' }
  // ]

  // Check that email is valid
  if (!validator.isEmail(formFields[0].value)) {
    throw new Error("Invalid email");
  }

  // check the name of the form fields are correct like first char is capital
  formFields.forEach((field) => {
    if (field.id === "first_name" || field.id === "last_name") {
      if (!validator.isAlpha(field.value)) {
        throw new Error("Invalid name");
      }
    }
  });

  return formFields.reduce((acc, field) => {
    // Capitalize the first letter of the field value
    acc[field.id] = field.value.charAt(0).toUpperCase() + field.value.slice(1);
    return acc;
  }, {});
}

// Add the user's first name and last name to the user metadata.
export async function updateMetadata(userId, formFields) {
  const { first_name, last_name } = formFields;

  try {
    // Update the user metadata
    const result = await UserMetadata.updateUserMetadata(userId, {
      first_name,
      last_name,
    });

    console.log(`Metadata updated userId(${userId}) `, result);
  } catch (error) {
    console.error("Error updating metadata: ", error.message);
  }
}
