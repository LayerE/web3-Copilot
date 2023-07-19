const restrictedWords = [
  "sec",
  "s e c",
  "securities and exchange commission",
  "securities & exchange commission",
  "exchange commission",
  "legal issues",
  "security",
  "ponzi",
  "invest",
  "hacking",
  "scam",
  "tokenomics",
  "tokonomics",
  "tekonomics",
];

const restrictedKeywords = async (message) => {
  try {
    let restricted = false;
    for (let i = 0; i < restrictedWords.length; i++) {
      if (message?.toLowerCase()?.includes(restrictedWords[i])) {
        restricted = true;
        break;
      }
    }
    return restricted;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default restrictedKeywords;
