import { IoAlertCircle } from "react-icons/io5";

export function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <p className="error">
      <IoAlertCircle /> {error.message}
    </p>
  );
}