import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  const severity = notification.isError ? "error" : "success";

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={severity}>
      {notification.message}
    </Alert>
  );
};

export default Notification;
