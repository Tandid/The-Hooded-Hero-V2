import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            {/* TODO: Can add keybindings guide here */}
        </div>
    );
}

export default App;

