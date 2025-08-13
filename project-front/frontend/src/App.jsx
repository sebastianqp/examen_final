import "./App.css";
import { useState } from "react";
import RegistroCompleto from "./components/RegistroCompleto";
import Listados from "./components/Listados";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="container">
      <header><h1>Sistema de Grupos de Investigación</h1></header>
      <RegistroCompleto onAfterSave={refresh} />
      <Listados refreshKey={refreshKey} />
    </div>
  );
}
