import "./App.css";
import { Container } from "react-bootstrap";

import Warriors from "./components/warriors";
import Lootboxs from "./components/lootboxs";
import Quests from "./components/quests";

function App(props) {
  return (
    <Container className="main">
      {/* <Warriors connection={props.connection} /> */}
      {/* <Lootboxs /> */}
      {/* <Quests /> */}
    </Container>
  );
}

export default App;
