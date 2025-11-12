import { Link } from 'react-router-dom';

import footer1 from '/src/assets/futbol-americano.png'

function Footer() {

    return (
        <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
            <aside>
                <div className="flex-1 items-center justify-center gap-2">
                    <div >
                        <Link to="/" className="flex grid-rows-1">
                            <p className="text-xl font-bold text-white">Canchitas</p>
                            <img
                                src={footer1}
                                alt="Logo"
                                className="w-8 h-8"
                            />
                        </Link>
                    </div>
                </div>
            </aside>
            <nav>
  <h6 className="footer-title">Social</h6>
  <div className="grid grid-flow-col gap-4">
    {/* YouTube */}
    <a 
    href="https://www.youtube.com/channel/UCqO7a2SS04U2iek4K0pvebA" target="_blank" rel="noopener noreferrer">
      <svg
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            className="fill-current">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
      </svg>
    </a>

    {/* Instagram */}
    <a 
    href="https://www.instagram.com/sv_canchitas?igsh=dHhhdHRxMmhpbHJw" target="_blank" rel="noopener noreferrer">
      <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            className="fill-current">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.33 3.608 1.305.975.975 1.243 2.242 1.305 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.33 2.633-1.305 3.608-.975.975-2.242 1.243-3.608 1.305-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.33-3.608-1.305-.975-.975-1.243-2.242-1.305-3.608C2.175 15.797 2.163 15.417 2.163 12s.012-3.584.07-4.85c.062-1.366.33-2.633 1.305-3.608C4.513 2.493 5.78 2.225 7.146 2.163 8.412 2.105 8.792 2.163 12 2.163zm0 1.838c-3.154 0-3.513.012-4.748.07-1.003.046-1.55.216-1.91.36-.48.187-.823.412-1.184.773-.361.361-.586.704-.773 1.184-.144.36-.314.907-.36 1.91-.058 1.235-.07 1.594-.07 4.748s.012 3.513.07 4.748c.046 1.003.216 1.55.36 1.91.187.48.412.823.773 1.184.361.361.704.586 1.184.773.36.144.907.314 1.91.36 1.235.058 1.594.07 4.748.07s3.513-.012 4.748-.07c1.003-.046 1.55-.216 1.91-.36.48-.187.823-.412 1.184-.773.361-.361.586-.704.773-1.184.144-.36.314-.907.36-1.91.058-1.235.07-1.594.07-4.748s-.012-3.513-.07-4.748c-.046-1.003-.216-1.55-.36-1.91a3.507 3.507 0 00-.773-1.184 3.507 3.507 0 00-1.184-.773c-.36-.144-.907-.314-1.91-.36-1.235-.058-1.594-.07-4.748-.07zM12 5.838a6.162 6.162 0 110 12.324 6.162 6.162 0 010-12.324zm0 1.838a4.324 4.324 0 100 8.648 4.324 4.324 0 000-8.648zm6.406-1.245a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"/>
      </svg>
    </a>

    {/* TikTok */}
    <a 
    href="https://www.tiktok.com/@canchitas.sv?_t=ZM-8xXbENXUZh2&_r=1" target="_blank" rel="noopener noreferrer">
      <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            className="fill-current">
            <path d="M12.75 2h2.25a4.75 4.75 0 004.75 4.75v2.25a6.998 6.998 0 01-4.75-1.772V16.5a6.75 6.75 0 11-6.75-6.75h.75v2.25h-.75a4.5 4.5 0 104.5 4.5V2z"/>
      </svg>
    </a>
  </div>
</nav>

            <nav>
                <h6 className="footer-title">Contacto</h6>
                <p className="link link-hover">svcanchitas@gmail.com</p>
            </nav>
            <nav className="flex grid-rows-2 justify-center items-center">
                <h6 className="footer-title">Sitio seguro</h6>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>

            </nav>

        </footer>
    );
}

export default Footer;