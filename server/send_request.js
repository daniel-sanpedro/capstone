const axios = require("axios");

axios
  .post(
    "http://localhost:3000",
    {
      test: "value",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
