import {createRoot} from 'react-dom/client'
import RemoteComponent from "./RemoteComponent.tsx";
import {useStore} from "wegar-store";
import * as React from "react";
import {useState} from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.WegarPackageReact = React

function App() {
  const [count, setCount] = useState(0)
  const [storeCount] = useStore('main-test', 0)
  const [loadRemote, setLoadRemote] = useState(false)
  return <div>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '10px',
      width: '100vw',
      height: '100vh',
    }}>
      <h1>storeCount: {storeCount}</h1>
      <div>
        <button
          onClick={() => setLoadRemote(!loadRemote)}
        >
          {loadRemote ? 'Unload Remote Component' : 'Load Remote Component'}
        </button>
      </div>
      {loadRemote ? <RemoteComponent
        url={'/WegarRemoteSubComponentTest.umd.cjs'}
        css
        props={{
          useStore,
          count,
          setCount
        }}>
        Loading Remote Component...
      </RemoteComponent> : "Please Click Load Remote Component"}
    </div>
  </div>
}

createRoot(document.getElementById('root')!).render(<App/>)
