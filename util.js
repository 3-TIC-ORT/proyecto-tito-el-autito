export const generateToken = (username) => {
    // Token falso para demo, podés reemplazarlo con JWT
    return Buffer.from(username + Date.now()).toString("base64");
  };