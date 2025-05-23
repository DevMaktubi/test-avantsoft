import { Provider } from "react-redux";
import { RouterComponent } from "./RouterComponent";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./config/store";
import { Toaster } from "sonner";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterComponent />
        <Toaster />
      </PersistGate>
    </Provider>
  );
}

export default App;
