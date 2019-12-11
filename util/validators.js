//helper function
const isEmpty = string => {
    if (string.trim() === "") return true;
    else return false;
  };
  const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
  };

  exports.validateSignUpData = (data) => {
      //input validation
    let errors = {};
  
    if (isEmpty(data.email)) {
      errors.email = "Must not be empty";
    } else if (!isEmail(data.email)) {
      errors.email = "Must be a valid email address";
    }
  
    if (isEmpty(data.password)) errors.password = "Must not be Empty";
    if(data.password.length < 5) errors.password = "Password must be more 6 characters or more"
    if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Passwords must Match";
    if (isEmpty(data.fullName)) errors.fullName = "Must not be Empty";


    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true :  false
    }
  }

  exports.validateLoginData = (data) => {
    let errors = {};
  
    if (isEmpty(data.email)) errors.email = "Must not be empty";
    if (isEmpty(data.password)) errors.password = "Must not be empty";
    if (!isEmail(data.email)) {
      errors.email = "Must be a valid email address";
    }
    if(data.password.length < 5) errors.password = "Password must be more 6 characters or more"

    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true :  false
    }
  };

  exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())){
      if(data.website.trim().substring(0, 4) !== 'http'){
        userDetails.website = `http://${data.website.trim()}`;
      } else userDetails.website = data.website
    }
    if(!isEmpty(data.location.trim())) userDetails.location = data.location;
    return userDetails
  }