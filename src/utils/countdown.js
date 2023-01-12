function countdown(countdownTo) {
    let now = new Date().getTime() / 1000;

    if (now > countdownTo) {
        now = countdownTo;
        return false;
    }

    const seconds = Math.floor(countdownTo - now);
    const days = Math.floor(seconds / 24 / 60 / 60);
    const hoursLeft = Math.floor(seconds - days * 86400);
    const hours = Math.floor(hoursLeft / 3600);
    const minutesLeft = Math.floor(hoursLeft - hours * 3600);
    const minutes = Math.floor(minutesLeft / 60);
    const rs = seconds % 60;

    return {
        d: days,
        h: hours >= 10 ? hours : `0${hours}`,
        m: minutes >= 10 ? minutes : `0${minutes}`,
        s: rs >= 10 ? rs : `0${rs}`,
    };
}

export default countdown;
