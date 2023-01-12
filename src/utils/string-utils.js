import dayjs from 'dayjs';
import { BigNumber, ethers } from 'ethers';
import { MAIN_TOKEN_DECIMALS } from './constants';

/**
 *
 *
 * @name formatDate
 * @description Formats single or multiple dates and returns a string. Accepts 2 arguments.
 * @param  {String} date unformatted date
 * @param  {String} customFormat (Optional) argument for a custom format returned
 * @return {String} "ddd, MMM D, h:mma - ddd, MMM D, h:mma"
 */
export const formatDate = (date, customFormat) => {
    date = dayjs(date);
    if (customFormat) {
        return date.format(customFormat);
    }
    return date.format('MMMM D, YYYY');
};

/** Used to format BG */
export function formatUnits(unit = MAIN_TOKEN_DECIMALS) {
    return ethers.utils.formatUnits(this, unit);
}

export function fromBgWithCommas(fixed = 2, unit = 9) {
    const fromBG = ethers.utils.formatUnits(this, unit);
    var parts = parseFloat(fromBG).toFixed(fixed).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

export function withCommas(fixed = 2) {
    var parts = parseFloat(this).toFixed(fixed).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

export function shorten(fixed = 0, fixed2IfBillion = false) {
    // Alter numbers larger than 1k
    if (this >= 1e3) {
        var units = ['k', 'M', 'B', 'T'];

        // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
        let unit = Math.floor((this.toFixed(0).length - 1) / 3) * 3;
        // Calculate the remainder
        let unitname = units[Math.floor(unit / 3) - 1];
        let num;
        if (fixed2IfBillion && unitname === 'B') {
            num = (this / ('1e' + unit)).toFixed(2);
            return num + unitname;
        } else {
            num = (this / ('1e' + unit)).toFixed(fixed);
            return num + unitname;
        }

        // output number remainder + unitname
    }

    // return formatted original number
    return this.toLocaleString();
}

export function shortenAddress() {
    if (ethers.utils.isAddress(this)) return `${this.substring(0, 6)}...${this.slice(-4)}`;
    else return `0x0000...0000`;
}

export function toHHMMSS() {
    var time = this;
    var ms = time % 1000;
    time = (time - ms) / 1000;
    var secs = time % 60;
    time = (time - secs) / 60;
    var mins = time % 60;
    var hrs = (time - mins) / 60;

    if (hrs < 10) hrs = `0${hrs}`;
    if (mins < 10) mins = `0${mins}`;
    if (secs < 10) secs = `0${secs}`;

    return hrs + ':' + mins + ':' + secs;
}

// Add method to prototype. this allows you to use this function on numbers and strings directly

BigNumber.prototype.formatUnits = formatUnits;
// eslint-disable-next-line
String.prototype.shorten = shorten;
// eslint-disable-next-line
String.prototype.numberWithCommas = withCommas;
// eslint-disable-next-line
String.prototype.shortenAddress = shortenAddress;
// eslint-disable-next-line
String.prototype.fromBgWithCommas = fromBgWithCommas;

// eslint-disable-next-line
Number.prototype.numberWithCommas = withCommas;
// eslint-disable-next-line
Number.prototype.shorten = shorten;
// eslint-disable-next-line
Number.prototype.toHHMMSS = toHHMMSS;
