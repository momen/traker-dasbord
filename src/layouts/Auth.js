import React from "react";
import styled, { createGlobalStyle } from "styled-components/macro";
import { CssBaseline } from "@material-ui/core";
import AuthGuard from "../components/AuthGuard";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }
  body {
    background: ${(props) => props.theme.palette.background.default};
  }
`;

const Root = styled.div`
  max-width: 520px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;

const Auth = ({ children }) => {
  return (
    <AuthGuard>
      <Root>
        <CssBaseline />
        <GlobalStyle />
        {children}
      </Root>
    </AuthGuard>
  );
};

export default Auth;
