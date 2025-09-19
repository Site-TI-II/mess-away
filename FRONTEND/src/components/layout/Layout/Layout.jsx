import { Outlet } from 'react-router-dom'
import Navbar from "../Navbar"
import Footer from "../Footer"

function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px', background: '#f5f5f5' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
export default Layout