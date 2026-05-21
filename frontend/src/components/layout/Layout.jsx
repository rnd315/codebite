import Navbar from './Navbar'
import MobileNav from './MobileNav'

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen text-foreground">
      <div aria-hidden className="bg-fx">
        <span className="glow-purple" />
        <span className="glow-cyan" />
      </div>
      <Navbar />
      <main className="relative z-10 pt-[56px] pb-16 sm:pb-4 mx-auto max-w-7xl px-4 lg:px-8">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
