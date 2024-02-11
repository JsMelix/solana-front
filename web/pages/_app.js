import "../styles/globals.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from '../styles/Home.module.css';

function MyApp({ Component, pageProps }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log("Billetera Phantom detectada");
        try {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
        } catch (error) {
          // No hacemos nada si la solicitud es rechazada
        }
      } else {
        setError("Billetera Phantom no instalada. Descargue e instale la extensión para usar esta aplicación.");
      }
    };

    checkIfWalletIsConnected();

    return () => {
      // Limpiar efectos si es necesario
    };
  }, []);

  const connectToPhantom = async () => {
    try {
      const { solana } = window;
      if (!solana || !solana.isPhantom) {
        throw new Error("Billetera Phantom no instalada. Descargue e instale la extensión para usar esta aplicación.");
      }

      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    } catch (error) {
      setError("Error al conectar con Phantom: " + error.message);
    }
  };

  return (
    <div>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {!walletAddress && !error && (
        <div className={styles.container}>
          <button
            className={styles.sol_connect_wallet_button}
            onClick={connectToPhantom}
          >
            Conectarse
          </button>
        </div>
      )}

      {walletAddress && (
        <div>
          <main>
            <nav className="border-b p-6">
              <p className="text-4xl font-bold">Platzi Movies</p>
              <div className="flex mt-4">
                <Link href="/">
                  <a className="mr-4">Inicio</a>
                </Link>
                <Link href="/add-movie">
                  <a className="mr-6">Agregar Películas</a>
                </Link>
                <Link href="/my-movies">
                  <a className="mr-6">Mis Películas</a>
                </Link>
              </div>
            </nav>
          </main>
          <Component {...pageProps} />
        </div>
      )}
    </div>
  );
}

export default MyApp;
