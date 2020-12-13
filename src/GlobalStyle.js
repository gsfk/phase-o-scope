import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: #191e22;
    margin: 0px;
  }

  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Montserrat', sans-serif;
      /* font-family: 'Montserrat Alternates', sans-serif; */
  }
`;