import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Log in to application</h2>
      <form
        onSubmit={(event) => {
          handleLogin(event);
          navigate("/");
        }}
      >
        <div>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            type="password"
            label="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            variant="standard"
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 15 }}>
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
