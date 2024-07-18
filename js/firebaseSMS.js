import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
const auth = getAuth();
window.confirmationResult = null;
auth.languageCode = "ko";

// window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//   size: "invisible",
//   callback: (response) => {
//     // reCAPTCHA solved, allow signInWithPhoneNumber.
//     onSignInSubmit();
//   },
// });
window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "invisible",
  callback: (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    onSignInSubmit();
  },
});
document
  .getElementById("phoneNumberButton")
  .addEventListener("click", (event) => {
    // event.preventDefault();
    const first_phone_element = document.getElementById("first-phone");
    const first_phone_number =
      first_phone_element.options[first_phone_element.selectedIndex].value;
    const last_phone_number = document.getElementById("phone").value;
    const phoneNumber = first_phone_number + last_phone_number;
    // const phoneNumber = "01090900876";
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, "+82" + phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log(confirmationResult);
        // ...
      })
      .catch((error) => {
        console.log(error);
        // Error; SMS not sent
        // ...
      });
  });

document
  .getElementById("confrimCodeButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    const code_element = document.getElementById("phone_check");
    const code = code_element.value;

    if (code_element.disabled === true) return;
    else {
      confirmationResult
        ?.confirm(code)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          console.log(result);

          code_element.disabled = true;
          document.getElementById("telecom").disabled = true;
          document.getElementById("first-phone").disabled = true;
          document.getElementById("phone").readOnly = true;
          document
            .getElementById("confrimCodeButton")
            .setAttribute("disabled", true);
        })
        .catch((error) => {
          console.log(error);
          alert("다시 입력하세요.");
          // User couldn't sign in (bad verification code?)
        });
    }
  });
