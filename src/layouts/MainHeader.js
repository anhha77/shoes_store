import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { replace } from "lodash";

const styleBtn = {
  color: "#fff",
  backgroundColor: "#cc571f",
  marginLeft: "15px",
  "&:hover": {
    backgroundColor: "#c23616",
  },
};

function MainHeader() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Logo />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            ShoesStore
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" color="inherit" component="div">
            Welcome {auth.user.username}
          </Typography>
          <Button
            onClick={() => {
              auth.logout(() => {
                navigate("/login", { replace: true });
              });
            }}
            sx={styleBtn}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
