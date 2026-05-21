import Navbar from './Navbar'
import MobileNav from './MobileNav'

// Variant of Layout with no max-width or horizontal padding.
// Used for full-viewport experiences like the split-screen curriculum lesson.
export default function LayoutFull({ children }) {
  return (
    <div className="relative flex h-screen flex-col text-foreground overflow-hidden">
      <div aria-hidden className="bg-fx">
        <span className="glow-purple" />
        <span className="glow-cyan" />
      </div>
      <Navbar />
      <main className="relative z-10 flex-1 pt-[56px] overflow-hidden">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
