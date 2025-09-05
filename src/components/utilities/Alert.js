
import { Alert } from "react-native";

export function showAlert(message, title = "Alert") {
  Alert.alert(title, message);
}
