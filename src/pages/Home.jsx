import { useEffect, useState } from "react";
import HighwayScene from "../components/HighwayScene/HighwayScene.jsx";
import StatusBar from "../components/StatusBar/StatusBar.jsx";
import HighwaySign from "../components/HighwaySign/HighwaySign.jsx";
import TruckArtBorder from "../components/TruckArtBorder/TruckArtBorder.jsx";
import MusicPlayer from "../components/MusicPlayer/MusicPlayer.jsx";
import TrackList from "../components/TrackList/TrackList.jsx";
import { playlist } from "../data/playlist.js";
import "./Home.css";

const shayaris = [
  "धीरे चल प्यारे, जीवन अनमोल है।",
  "धीरे चलोगे तो बार-बार मिलोगे, तेज चलोगे तो हरिद्वार मिलोगे।",
  "दम है तो क्रॉस कर, नहीं तो बर्दाश्त कर।",
  "वाहन चलाते समय सौंदर्य दर्शन ना करें वरना देव दर्शन हो जाएंगे।",
  "सावधानी हटी, सब्जी-पूड़ी बंटी।",
  "हवा से बातें करता है, जरा हट के चल।",
  "यह तूफान मेल से कम नहीं, और किसी में इतना दम नहीं।",
  "धीरे चलाने वाला भी मर्द होता है, यकीन मानिए हड्डियां टूटती हैं तो दर्द होता है।",
  "गंगा तेरा पानी अमृत।",
  "मां का आशीर्वाद है, यूं ही चलते रहेंगे।",
  "ऐ मालिक, क्यों बनाया गाड़ी बनाने वाले को, घर बेघर कर दिया गाड़ी चलाने वाले को।",
  "मिलेगा मुकद्र, या रब तेरा ही आसरा।",
  "बुरी नजर वाले तेरा मुंह काला।",
  "कोई जलो मत भाई से, समझ गए ना अब किसी से नहीं जलना।",
  "सोच कर सोचो, साथ क्या जाएगा।",
  "सड़कों का राजा, ऐसे ही चलता है।",
  "भर के चले, फिर भी एक दिन खाली हाथ ही जाना है।",
  "किस्मत तेरी दासी है, घर में मथुरा काशी है।",
  "मालिक की गाड़ी, ड्राइवर का पसीना, चलती है रोड पर बन कर हसीना।",
  "अनार कली भर कर चली।",
  "लटक मत, पटक दूंगी।",
  "नीम का पेड़ चंदन से कम नहीं, हमारा गुडगाँव लंदन से कम नहीं।",
  "जरा कम पी मेरी रानी, इराक का पानी बहुत महंगा है।",
  "मैं भी बड़ा होकर ट्रक बनूंगा।",
  "जल मत पगली, किस्तों पे आई है।",
  "18 की बीनणी, 21 का दूल्हा, बाल विवाह करना अपराध है।",
  "जब बेटी ही नहीं बचाओगे, तो बहू कहां से लाओगे।",
  "भगवान ही बचाए इन तीनों से, डाक्टर, पुलिस और हसीनों से।",
  "हस मत पगली वरना प्यार हो जाएगा तो प्यार हुआ क्या?",
  "बॉयफ्रेंड के साथ बैठकर भैया कहना मना है।",
  "बुरी नजर वाले, तेरे बच्चे जियें; बड़े होकर, तेरा ही खून पियें !",
  "मिनी ट्रक पर लिखा हुआ - बड़ा होकर ट्रक बनूँगा !",
  "क्यों मरते तो बेवफा सनम के लिए, दो गज जमीन मिलेगी दफन के लिए।",
  "मरना हो तो मरो अपने वतन की मिट्टी के लिए , हसीना भी दुपट्टा उतार देगी कफन के लिए।",
  "अपनी आजादी को हरगिज मिटा सकते नहीं।",
  "सर कटा सकते हैं लेकिन सर झुका सकते नहीं।",
  "इश्क तो करता है हर कोई, महबूब पर मरता है हर कोई।",
  "कभी अपने वतन को महबूब बना कर देखो, तुझपे मरेगा हर कोई।",
  "ये बात हवाओं को बताए रखना, रोशनी होगी चिरागों को जलाए रखना।",
  "लहू देकर भी जिसकी हिफाजत की, उस तिरंगे को तू दिल में बसाए रखना।",
];

function pickRandomShayari(previousShayari) {
  if (shayaris.length === 1) return shayaris[0];

  let nextShayari = previousShayari;
  while (nextShayari === previousShayari) {
    nextShayari = shayaris[Math.floor(Math.random() * shayaris.length)];
  }

  return nextShayari;
}

// This is the only place that knows "which track is selected" — both
// MusicPlayer (the player controls) and TrackList (the up-next list)
// receive it as props, so picking a song in the list also plays it.
export default function Home() {
  // Start on a random track each time the page loads
  const [trackIndex, setTrackIndex] = useState(
    () => Math.floor(Math.random() * playlist.length)
  );
  const [currentShayari, setCurrentShayari] = useState(() =>
    pickRandomShayari()
  );

  useEffect(() => {
    setCurrentShayari((previousShayari) =>
      pickRandomShayari(previousShayari)
    );
  }, [trackIndex]);

  return (
    <div className="home">
      <HighwayScene />

      <div className="home__content">
        <StatusBar />
          <HighwaySign />
        {/* <TruckArtBorder>
        </TruckArtBorder> */}

        <section className="home__shayaris" aria-label="Shayari collection">
          <p className="home__shayari">"{currentShayari}"</p>
        </section>

        <div className="home__spacer" />

        {/* <TrackList
          tracks={playlist}
          trackIndex={trackIndex}
          setTrackIndex={setTrackIndex}
        /> */}

        <MusicPlayer
          tracks={playlist}
          trackIndex={trackIndex}
          setTrackIndex={setTrackIndex}
        />
      </div>
    </div>
  );
}
