const creditsCalc = (credits) => {
    let maxCredits = 40;
    let maxDailyCredits = 15;
   if(credits >= maxCredits){
    return 0;
   }
    else if(credits + maxDailyCredits > maxCredits){
        return maxCredits - credits;
    }
    else{
        const tokensToAdd = Math.min(maxDailyCredits, maxCredits - credits);
        return tokensToAdd;
    }
}

export default creditsCalc;