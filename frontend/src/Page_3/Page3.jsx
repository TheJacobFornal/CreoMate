import React from 'react';
import './Page3.css';

const Page3 = () => {
    return (
        <div className="page3-wrapper">
            <h2 className="page3-title">Instrukcja:</h2>

            <div className="instruction-box">
                <h3 className="section-header">✅ Wspólna dla obu procesów</h3>
                <ul className="instruction-list">
                    <li>Usuwamy myślnik w Typie</li>
                    <ul>
                        <li>Brak typu → <span className="tag blue">błękitny</span></li>
                    </ul>
                    <li>Zaznaczanie całego wiersza dla wartości z końcówką od (H1 do H…) → <span className="tag yellow">żółty</span></li>
                    <li>Dla części handlowych i normaliów sprawdzanie, czy jest producent → <span className="tag red">czerwony</span></li>
                    <li>
                        Kol. B, Kol. C lub Kol. I zawiera domyślny opis:
                        <ul>
                            <li>nr. Katalogowy, nazwa katalogowa lub producent → <span className="tag orange">pomarańczowy</span></li>
                        </ul>
                    </li>
                    <li>
                        Jeżeli typ jest Produkowany:
                        <ul>
                            <li>Materiał, Obróbka Cieplna, Obróbka Powierzchni, musi coś zawierać → <span className="tag olive">oliwkowy</span></li>
                            <li>Kol. G i H – jeśli „brak”, zmienić na „Brak / None”</li>
                        </ul>
                    </li>
                    <li>W kol. C zamienia wszystko na DUŻE LITERY</li>
                    <li>W kol. B znajduje się „_”, oprócz Profili → <span className="tag violet">jasny fiolet</span></li>
                    <li>Sprawdza, czy w folderze są pliki z trzema rozszerzeniami (.stp, .dwg, .pdf) → <span className="tag cyan">niebieski</span></li>
                    <li>
                        Dla części typu S (spawane):
                        <ul>
                            <li>Jest to złożenie → szukamy folderu → <span className="tag brown">brązowy</span></li>
                            <li>Jeśli pojedyncza część → szukamy pliku</li>
                        </ul>
                    </li>
                </ul>

                <h3 className="section-header">🛠️ Tylko dla Konstruktorów</h3>
                <ul className="instruction-list">
                    <li>Dla Profili, weryfikacja czy początek nazwy Creo jest w numerze detalu → <span className="tag gray">szary</span></li>
                    <li>
                        ZA01_12341L – odbicie lustrzane innej części (część lewa):
                        <ul>
                            <li>Znajduje prawą część i do kol. D - ilość, dopisuje <code>1+1L</code> / lewy detal → <span className="tag pink">różowy</span></li>
                            <li>Jeśli jest tylko lewa część → w kol. D wpisuje <code>0+1L</code>, a w kol. I dopisuje „wykonać w lustrze!” → <span className="tag green">zielony</span></li>
                        </ul>
                    </li>
                    <li>W kol. I usuwać „kat.” np. kat. Bosch → zostaje „Bosch”</li>
                    <li>W kol. I: pierwsza litera duża, reszta małe</li>
                </ul>
            </div>
        </div>
    );
};

export default Page3;
