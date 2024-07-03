const axios = require("axios");

axios
  .post(
    "https://capstone-7etx.onrender.com",
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
