import { Header } from './components/Header'
import { FrameSequence } from './components/FrameSequence/FrameSequence'
import { Footer } from './components/Footer'

function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <FrameSequence />
      </main>
      <Footer />
    </div>
  )
}

export default App
