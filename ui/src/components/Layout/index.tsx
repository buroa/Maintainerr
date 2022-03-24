import Head from 'next/head'
import router from 'next/router'
import { useContext, useState } from 'react'
import SearchContext from '../../contexts/search-context'
import SearchBar from '../Common/SearchBar'
import NavBar from './NavBar'

const Layout: React.FC = (props) => {
  const [isScrolled, setIsScrolled] = useState(false)

  const [navBarOpen, setNavBarOpen] = useState(true)
  const SearchCtx = useContext(SearchContext)

  const navbarClosed = () => {
    setNavBarOpen(!navBarOpen)
  }

  return (
    <section>
      <Head>
        <title>Maintainerr</title>
      </Head>
      <div className="flex h-full min-h-full min-w-0 bg-gray-900">
        <div className="pwa-only fixed inset-0 z-20 h-1 w-full border-gray-700 md:border-t" />
        <div className="absolute top-0 h-64 w-full bg-gradient-to-bl from-gray-800 to-gray-900">
          <div className="relative inset-0 h-full w-full bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
        <NavBar open={navBarOpen} setClosed={navbarClosed}></NavBar>
        <div className="relative mb-16 flex w-0 min-w-0 flex-1 flex-col lg:ml-64"></div>
        <div
          className={`searchbar fixed left-0 right-0 top-0 z-10 flex flex-shrink-0 bg-opacity-80 transition duration-300 ${
            isScrolled ? 'bg-gray-700' : 'bg-transparent'
          } lg:left-64`}
          style={{
            backdropFilter: isScrolled ? 'blur(5px)' : undefined,
            WebkitBackdropFilter: isScrolled ? 'blur(5px)' : undefined,
          }}
        >
          <button
            className={`px-4 text-white ${
              isScrolled ? 'opacity-90' : 'opacity-70'
            } transition duration-300 focus:outline-none lg:hidden`}
            aria-label="Open sidebar"
            onClick={() => setNavBarOpen(true)}
          >
            {/* <MenuAlt2Icon className="h-6 w-6" /> */}
          </button>
          <div className="flex flex-1 items-center justify-between pr-4 md:pr-4 md:pl-4">
            <button
              className={`mr-2 text-white ${
                isScrolled ? 'opacity-90' : 'opacity-70'
              } pwa-only transition duration-300 hover:text-white focus:text-white focus:outline-none`}
              onClick={() => router.back()}
            >
              {/* <ArrowLeftIcon className="w-7" /> */}
            </button>
            <SearchBar
              onSearch={(text: string) => {
                SearchCtx.addText(text)
                router.push('/overview')
              }}
            />
            {/* <div className="flex items-center"><UserDropdown /></div> */}
          </div>
        </div>

        <main
          className="relative top-16 z-0 w-full focus:outline-none"
          tabIndex={0}
        >
          <div className="mb-6">
            <div className="max-w-8xl mx-auto px-4">{props.children}</div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default Layout
