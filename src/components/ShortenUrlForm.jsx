/* eslint no-unused-vars: 1 */

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import useCopyToClipboard from '../hooks/useCopyToClipboard';

const ShortenUrlForm = () => {
    const [value, setValue] = useState('');
    const [generateQr, setGenerateQr] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedText, copy] = useCopyToClipboard();
    const [visible, setVisible] = useState(false)

    const BASE_URL = 'https://api-ssl.bitly.com/v4';

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
          }, 2000);

          return () => clearTimeout(timer);
    }, [visible])
    
    const onChange = useCallback(
        (e) => {
            setValue(e.target.value);
        },
        [value],
    );

    
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            
            const headers = {
                'Authorization': `Bearer ${process.env.REACT_APP_BITLY_AUTHORIZATION_TOKEN}`
            }
            
            const data = {
                long_url: value
            }

            axios.post(`${BASE_URL}/shorten`, data, {
                headers
            })
            .then((response) => {
                copy(response.data.link);
                setVisible(true)
            })
            .catch((error) => {
                setErrorMessage(`Oops. Something went wrong. ${error.message}`)
            }) 
        },
        [value],
    );

    const handleClear = () => {
        copy('');
        setGenerateQr(false);
        setValue('');
    };

    return (
        <section className="container">
            <form onSubmit={onSubmit}>
                <label htmlFor="shorten">
                    Url:
                    <input
                        placeholder="Url to shorten"
                        id="shorten"
                        type="text"
                        value={value}
                        onChange={onChange}
                    />
                </label>
                <input type="submit" value="Shorten and copy URL" />

            </form>
            {copiedText && (
                <div className="result">
                    <input value={copiedText} readOnly />
                    {visible && <span>Copied to clipboard!!!</span>}
                </div>
            )}

            {errorMessage && <div className="error">{errorMessage}</div>}

            {generateQr && copiedText && (
                <div className="qr-container">
                    <QRCode value={copiedText} />
                </div>
            )}

            {copiedText && !visible && (
                <>
                    {!generateQr && <button type="button" className="primary-button" onClick={() => setGenerateQr(true)}>Generate QR code</button>}
                    {!generateQr && <p className="button-divider">or</p>}
                    <button type="button" className="primary-button" onClick={handleClear}>Try another one</button>
                </>
            )}
        </section>
    );
};

export default ShortenUrlForm;
