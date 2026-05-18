const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  const className = notification.isError
    ? "notification error"
    : "notification";

  return <div className={className}>{notification.message}</div>;
};

export default Notification;
