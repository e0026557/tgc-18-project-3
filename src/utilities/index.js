function validateEmail(email) {
  let regex = /^[\w#][\w\.\’+#](.[\w\\’#]+)\@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)*(.[a-zA-Z]{2,20})$/;

  if (email.match(regex)) {
    return true;
  }
  return false;
}

function validatePassword(password) {
  let regex = /^(?!.*\s).{3,100}$/;

  if (password.match(regex)) {
    return true;
  }
  return false;
}

function validateContactNumber(number) {
  let regex = /^(?!.*[a-zA-Z])(?=.*\d).{1,15}$/;

  if (number.match(regex)) {
    return true;
  }
  return false;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateContactNumber
};