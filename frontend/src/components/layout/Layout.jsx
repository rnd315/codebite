import Navbar from './Navbar'
import MobileNav from './MobileNav'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <div aria-hidden className="bg-fx">
        <span className="glow-purple" />
        <span className="glow-cyan" />
      </div>
      <Navbar />
      <main className="relative z-10 flex-1 pt-[56px] pb-16 sm:pb-4 mx-auto w-full max-w-7xl px-4 lg:px-8">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
