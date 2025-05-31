export const validateEmail = (email) => {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
};

export const getsInitial= (title) => {
  if(!title) return "";
  const words= title.split(" ");

  let initials= "";

  for(let i=0; i<words.length; i++){
    if(words[i].length > 0){
      initials += words[i][0];
    }
  }
  
  return initials.substring(0,2);
};
